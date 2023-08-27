import { APP_RES_URL } from '@/common/constants';
import request from './request';

const configApi = {
  getConfig: async (data: {}) => {
    return request.get(APP_RES_URL + 'config.json', data, { showLoading: false });
  },
};

export default configApi;
