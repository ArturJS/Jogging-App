const testUser = {
  email: 'test@user.com',
  firstName: 'John',
  lastName: 'Doe',
  password: '123'
};

export default { // todo integrate with sequelizejs
  User: {
    find: ({where}) => {
      const {id, email, token} = where;
      if (id || token || email === testUser.email) {
        return Promise.resolve({id, ...testUser});
      }
      console.log(`Wrong user ${JSON.stringify(where)}`);
      return Promise.resolve(null);
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