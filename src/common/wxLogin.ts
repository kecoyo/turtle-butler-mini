import loginApi from '@/apis/loginApi';
import { setUserInfo } from '@/redux/reducers/global';
import store from '@/redux/store';
import Taro from '@tarojs/taro';

/**
 * 微信登录，获取code
 * @returns
 */
const wxlogin = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log('✌ ~ Taro.login');
    Taro.login({
      success: (res) => {
        console.log('✌ ~ Taro.login:success', res);
        // {errMsg: "login:ok", code: "031xJ61w3kZz803GdD3w3t2oJh4xJ61i"}
        resolve(res.code);
      },
      fail: (err) => {
        console.log('✌ ~ Taro.login:fail', err);
        resolve('');
      },
    });
  });
};

/**
 * 首次进入，检测登录
 */
export const checkLogin = async (): Promise<void> => {
  console.log('✌ ~ loginByCode');
  let code = await wxlogin();
  let userInfo = await loginApi.miniProgram({ code });
  if (userInfo) {
    console.log('✌ ~ loginByCode:success', userInfo);
    await store.dispatch(setUserInfo(userInfo));
  } else {
    console.log('✌ ~ loginByCode:fail', userInfo);
  }
};

/**
 * 数据请求时，token过期，静默登录
 */
export const silentLogin = async (): Promise<void> => {
  console.log('✌ ~ silentLogin');
  let code = await wxlogin();
  let userInfo = await loginApi.miniProgram({ code });
  if (userInfo) {
    console.log('✌ ~ silentLogin:success', userInfo);
    await store.dispatch(setUserInfo(userInfo));
  } else {
    console.log('✌ ~ silentLogin:fail', userInfo);
    throw new Error('silentLogin:fail');
  }
};
