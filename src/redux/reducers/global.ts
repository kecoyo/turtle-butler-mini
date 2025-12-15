import areaApi from '@/apis/areaApi';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import _ from 'lodash';
import { AppDispatch, RootState } from '../store';

// 为 slice state 定义一个类型
interface GlobalState {
  // 登录用户信息
  userInfo?: UserInfo;

  // 全部区域列表
  allAreas: Area[];
  allAreaMap: Record<number, Area>;
}

// 使用该类型定义初始 state
const initialState: GlobalState = {
  userInfo: undefined,
  allAreas: [],
  allAreaMap: {},
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    // set state
    setGlobalState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearGlobalState: (state) => {
      Object.assign(state, initialState);
    },
    // 设置用户信息，登录成功是调用
    setUserInfo: (state, action) => {
      const data = action.payload;
      let userInfo: UserInfo = {
        ...data,
        birthday: data.birthday ? dayjs(data.birthday).format('YYYY-MM-DD') : undefined,
      };
      Taro.setStorageSync('token', userInfo.token);
      state.userInfo = userInfo;
    },
    // 修改用户信息
    updateUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    // 清除用户信息
    clearUserInfo: (state) => {
      state.userInfo = undefined;
    },
    // 设置全部区域
    setAllAreas: (state, action) => {
      const areas: Area[] = action.payload;
      state.allAreas = areas;
      state.allAreaMap = _.keyBy(areas, 'id');
    },
  },
});

export const { setGlobalState, clearGlobalState, setUserInfo, updateUserInfo, clearUserInfo, setAllAreas } = globalSlice.actions;
export const globalSelector = (state: RootState) => state.global;

/**
 * 获取全部的区域列表
 * @returns
 */
export const fetchAllAreas = () => async (dispatch: AppDispatch) => {
  let areas = await areaApi.getAllAreas();
  dispatch(setAllAreas(areas));
};

export default globalSlice.reducer;
