import shortId from 'shortid';

const _usersStorage = {
  'test@user.com': {
    email: 'test@user.com',
    firstName: 'John',
    lastName: 'Doe',
    password: '123'
  }
};

const _recordsStorage = {};

export default { // todo integrate with sequelizejs
  User: {
    find: ({where}) => {
      const {email} = where;
      const relatedUser = _usersStorage[email];

      if (relatedUser) {
        return Promise.resolve(relatedUser);
      }
      console.log(`Wrong user ${JSON.stringify(where)}`);
      return Promise.resolve(null);
    },

    create: (user) => {
      _usersStorage[user.email] = user;
      return Promise.resolve(user);
    },

    validPassword: (password, userPassword, done, user) => {
      if (password === userPassword) {
        done(null, user);
      }
      else {
        done('Wrong email or password', null);
      }
    }
  },

  Record: {
    findAll: ({where}) => {
      const {email} = where;
      const recordsList = Object.values(_recordsStorage).filter(record => record.email === email);
      return Promise.resolve(recordsList);
    },

    create: (record) => {
      record.id = shortId.generate();
      _recordsStorage[record.id] = record;
      return Promise.resolve(record);
    },

    update: (record) => {
      const {id} = record;
      const relatedRecord = _recordsStorage[id];

      if (relatedRecord){
        Object.assign(relatedRecord, record);
      }
      else {
        _recordsStorage[id] = record;
      }

      return Promise.resolve(record);
    },
  }
}