import { ApiCode } from '@/common/enums';
import { hideLoading, showErrorMsg, showLoading, throwError } from '@/common/utils';
import { silentLogin } from '@/common/wxLogin';
import Taro from '@tarojs/taro';
import _ from 'lodash';

const request = {
  baseRequest(method: string | any, url: string, data?: API.Data, options?: API.Option) {
    url = url.startsWith('/') ? BASE_URL + url : url;
    data = data || {};
    options = options || {};

    const token = Taro.getStorageSync('token');

    const option = _.defaultsDeep({}, options, {
      method: method, //请求方式
      url: url, //地址
      data: data, //传参
      timeout: 60000, // 超时时间
      header: { Authorization: token },
    });

    console.log('🥕 ~ request:', url, data);
    return Taro.request(option).then((res) => {
      if (res.statusCode === 200) {
        console.log('🥕 ~ response:', url, res.data);
        return res.data;
      } else {
        throw new Error(res.data.msg);
      }
    });
  },
  async baseRequest2(method: string | any, url: string, data?: API.Data, options?: API.Option) {
    // 原始请求，未加工处理的
    if (options && options.showLoading === false) {
      let res = await this.baseRequest(method, url, data, options);
      return res;
    }

    let times = 0; // 计数，重试3次

    // token过期，自动静默登录
    const sendRequest = async (): Promise<API.Result> => {
      times++;
      let res = await this.baseRequest(method, url, data, options);
      if (res.code === ApiCode.invalidToken && times < 3) {
        await silentLogin();
        return await sendRequest();
      }
      return res;
    };

    // 业务数据请求
    try {
      showLoading();
      let res = await sendRequest();
      hideLoading();
      throwError(res);
      return res.data;
    } catch (err) {
      hideLoading();
      showErrorMsg(err);
      throw err;
    }
  },
  get(url: string, data?: API.Data, options?: API.Option) {
    return this.baseRequest2('GET', url, data, options);
  },
  post(url: string, data?: API.Data, options?: API.Option) {
    return this.baseRequest2('POST', url, data, options);
  },
};

export default request;
