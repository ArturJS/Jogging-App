import baseApi from './baseApi';

export const loginApi = {
  doSignIn({email, password}, params) {
    return baseApi.ajax({
      method: 'post',
      url: '/sign-in',
      data: {
        username: email,
        password
      }
    }, params)
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  },

  doSignOut(params) {
    return baseApi.ajax({
      method: 'post',
      url: '/sign-out'
    }, params)
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
  }, params) {
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
    }, params)
      .then(res => res.data)
      .then(data => {
        return {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        };
      });
  },

  getUserData(params) {
    return baseApi.ajax({
      method: 'get',
      url: '/user-data'
    }, params)
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
