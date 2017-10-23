const testUser = {
  email: 'test@user.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123'
};

export default { // todo integrate with sequelizejs
  User: {
    find: ({where}) => {
      console.log('SEARCH USER');
      console.dir(where);
      const {id, email, token} = where;
      if (id || token || email === testUser.email) {
        return Promise.resolve({id, ...testUser});
      }
      return Promise.reject(`Wrong user ${JSON.stringify(where)}`);
    },

    update: (data, {where}) => {

    },

    validPassword: (password, userPassword, done, user) => {
      console.log('password', password);
      console.log('userPassword', userPassword);
      console.log('user', user);
      if (password === userPassword) {
        done(null, user);
      }
      else {
        done('Wrong email or password', null);
      }
    }
  }
}