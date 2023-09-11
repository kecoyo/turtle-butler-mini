import configApi from '@/apis/configApi';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import _ from 'lodash';
import { AppDispatch, RootState } from '../store';

// 为 slice state 定义一个类型
interface ConfigState {
  account: {
    default_icon: string;
  };
  mine: {
    bg_png: string;
  };
  others: {
    avatar_png: string;
    empty_png: string;
  };
}

// 使用该类型定义初始 state
const initialState: ConfigState = {
  account: {
    default_icon: 'upload/butler_icon/2f/1fb149e400aabb1e19966f71d4ddf2.png',
  },
  mine: {
    bg_png: 'assets/mine/bg.png',
  },
  others: {
    avatar_png: 'assets/others/avatar.png',
    empty_png: 'assets/others/empty.png',
  },
};

export const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    // set state
    setConfigState: (state, action) => {
      const config = action.payload;
      Object.assign(state, config);

      // 保存 config 到 Storage 中
      Taro.setStorageSync('config', JSON.stringify(config));
    },
    // clear state
    clearConfigState: (state) => {
      Object.assign(state, initialState);
    },
    // 从 Storage 中取出 config
    initConfigFromStorage: (state) => {
      let value = Taro.getStorageSync('config');
      if (value) {
        value = JSON.parse(value) as ConfigState;
      } else {
        value = {};
      }
      Object.assign(state, _.defaultsDeep({}, value, initialState));
    },
  },
});

export const { setConfigState, clearConfigState, initConfigFromStorage } = configSlice.actions;
export const configSelector = (state: RootState) => state.config;

/**
 * 获取配置信息
 * @returns
 */
export const fetchConfig = () => async (dispatch: AppDispatch) => {
  let config = await configApi.getConfig({ t: Date.now(), token: '' });
  dispatch(setConfigState(config));
};

export default configSlice.reducer;
