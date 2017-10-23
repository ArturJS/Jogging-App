import baseApi from './baseApi';

export const loginApi = {
  doSignIn({email, password}) {
    return baseApi.ajax({
      method: 'post',
      url: '/sign-in',
      data: {
        username: email,
        password
      }
    })
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  },

  doSignOut() {
    return baseApi.ajax({
      method: 'post',
      url: '/sign-out'
    })
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  },

  doSignUp({
    firstName,
    lastName,
    email,
    password,
    repeatPassword
  }) {
    return baseApi.ajax({
      method: 'post',
      url: '/sign-up',
      data: {
        firstName,
        lastName,
        email,
        password,
        repeatPassword
      }
    })
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  },

  getUserData() {
    return baseApi.ajax({
      method: 'get',
      url: '/user-data'
    })
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  }
};
