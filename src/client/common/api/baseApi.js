import axios from 'axios';
import _ from 'lodash';

import {config} from './apiConfig';
import {routerStore, userStore, loadingStore} from '../stores';


const baseApi = {
  async ajax(request, {showLoading = false} = {}) {
    loadingStore.toggleLoading(showLoading);

    try {
      const res = await axios({...config, ...request});
      return res;
    }
    catch (error) {
      const {history} = routerStore;
      const {pathname} = history.location;

      if (_.get(error, 'response.status') === 401 && pathname !== '/sign-up') {
        userStore.resetUserData();
        history.replace('/sign-up');
      }

      console.error(error);
      throw error;
    }
    finally {
      loadingStore.toggleLoading(false);
    }
  }
};

export default baseApi;
