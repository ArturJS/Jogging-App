import axios from 'axios';
import _ from 'lodash';

import {config} from './apiConfig';
import {routerStore, userStore} from '../stores';


const baseApi = {
  ajax(request) {
    const promise = axios({...config, ...request});

    promise
      .then((res) => {
        return res;
      })
      .catch((error) => {
        const {history} = routerStore;
        const {pathname} = history.location;

        if (_.get(error, 'response.status') === 401 && pathname !== '/sign-up') {
          userStore.resetUserData();
          history.replace('/sign-up');
        }

        console.error(error);
      });

    return promise;
  }
};

export default baseApi;
