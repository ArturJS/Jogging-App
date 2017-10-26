import {observable, action, computed} from 'mobx';

class LoadingStore {
  @observable _isLoading = false;

  @action toggleLoading(flag = !this._isLoading) {
    this._isLoading = flag;
  }

  @computed get isLoading() {
    return this._isLoading;
  }
}

export default new LoadingStore();