import { observable, extendObservable, action, computed } from 'mobx';
import _ from 'lodash';
import { loginApi } from '../../api/loginApi';

class UserStore {
  @observable
  _userData = {
    email: null,
    firstName: null,
    lastName: null
  };

  @observable isInitialized = false;

  async init(userData) {
    if (__SERVER__ && userData) {
      this.setUserData(userData);
    } else if (__CLIENT__) {
      const initialUserData = _.get(
        window,
        '__INITIAL_APP_STATE__.stores.userStore'
      );
      // (initialUserData === null) - this is flag from server side if user is NOT authorized
      if (initialUserData) {
        this.setUserData(initialUserData);
      } else if (initialUserData !== null) {
        // in case of static html export
        await this._initByAjax();
      }
    }

    this.isInitialized = true;
  }

  async _initByAjax() {
    try {
      const userData = await loginApi.getUserData({ showLoading: true });
      this.setUserData(userData);
    } catch (err) {
      // eslint-disable-line
    }
  }

  @action
  setUserData = ({ email, firstName, lastName }) => {
    extendObservable(this._userData, {
      email,
      firstName,
      lastName
    });
  };

  getUserData() {
    return this._userData;
  }

  resetUserData() {
    this.setUserData({
      email: null,
      firstName: null,
      lastName: null
    });
  }

  async doSignIn({ email, password }, params) {
    const userData = await loginApi.doSignIn({ email, password }, params);
    this.setUserData(userData);
    return userData;
  }

  async doSignOut(params) {
    this.resetUserData();
    return loginApi.doSignOut(params);
  }

  async doSignUp(
    { firstName, lastName, email, password, repeatPassword },
    params
  ) {
    const userData = await loginApi.doSignUp(
      {
        firstName,
        lastName,
        email,
        password,
        repeatPassword
      },
      params
    );
    this.setUserData(userData);
    return userData;
  }

  @computed
  get isLoggedIn() {
    const { email, firstName, lastName } = this._userData;
    return email && firstName && lastName;
  }
}

export default new UserStore();
