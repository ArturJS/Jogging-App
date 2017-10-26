import {
  observable,
  extendObservable,
  action,
  computed
} from 'mobx';
import {loginApi} from '../../api/loginApi';

class UserStore {
  @observable _userData = {
    email: null,
    firstName: null,
    lastName: null
  };

  @observable isInitialized = false;

  async init() {
    try {
      const userData = await loginApi.getUserData({showLoading: true});
      this._setUserData(userData);
    }
    catch (err) {
      // eslint-disable-line
    }
    this.isInitialized = true;
  }

  @action
  _setUserData = ({
    email,
    firstName,
    lastName
  }) => {
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
    this._setUserData({
      email: null,
      firstName: null,
      lastName: null
    });
  }

  async doSignIn({email, password}, params) {
    const userData = await loginApi.doSignIn({email, password}, params);
    this._setUserData(userData);
    return userData;
  }

  async doSignOut(params) {
    this.resetUserData();
    return loginApi.doSignOut(params);
  }

  async doSignUp({
    firstName,
    lastName,
    email,
    password,
    repeatPassword
  }, params) {
    const userData = await loginApi.doSignUp({
      firstName,
      lastName,
      email,
      password,
      repeatPassword
    }, params);
    this._setUserData(userData);
    return userData;
  }

  @computed
  get isLoggedIn() {
    const {
      email,
      firstName,
      lastName
    } = this._userData;
    return email && firstName && lastName;
  }
}

export default new UserStore();
