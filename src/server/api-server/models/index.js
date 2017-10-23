import _ from 'lodash';

const _usersStorage = [
  {
    email: 'test@user.com',
    firstName: 'John',
    lastName: 'Doe',
    password: '123'
  }
];

export default { // todo integrate with sequelizejs
  User: {
    find: ({where}) => {
      const {email} = where;
      const relatedUser = _.find(_usersStorage, (user) => user.email === email);

      if (relatedUser) {
        return Promise.resolve(relatedUser);
      }
      console.log(`Wrong user ${JSON.stringify(where)}`);
      return Promise.resolve(null);
    },

    create: (user) => {
      _usersStorage.push(user);
      return Promise.resolve(true);
    },

    update: (data, {where}) => {

    },

    validPassword: (password, userPassword, done, user) => {
      if (password === userPassword) {
        done(null, user);
      }
      else {
        done('Wrong email or password', null);
      }
    }
  }
}