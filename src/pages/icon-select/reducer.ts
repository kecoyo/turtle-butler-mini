import iconApi from '@/apis/iconApi';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { TabItem } from 'taro-ui/types/tabs';

// 为 slice state 定义一个类型
interface IconSelectState {
  tabList: TabItem[];
  tabIndex: number;
  iconList: IconInfo[];
}

// 使用该类型定义初始 state
const initialState: IconSelectState = {
  tabList: [],
  tabIndex: 0,
  iconList: [],
};

export const iconSelectSlice = createSlice({
  name: 'iconSelect',
  initialState: initialState,
  reducers: {
    // set state
    setIconSelectState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearIconSelectState: (state) => {
      Object.assign(state, initialState);
    },
    // 设置图标选择列表
    setIconSelectList: (state, action) => {
      const iconList: IconInfo[] = action.payload;
      state.iconList = iconList;
      state.tabList = iconList.map((icon): TabItem => ({ title: icon.name }));
      state.tabIndex = 0;
    },
  },
});

export const { setIconSelectState, clearIconSelectState, setIconSelectList } = iconSelectSlice.actions;
export const iconSelectSelector = (state: RootState) => state.iconSelect;

/**
 * 获取图标选择列表
 */
export const fetchIconSelectList = () => async (dispatch: AppDispatch, getState: AppGetState) => {
  const iconList = await iconApi.getIconList();
  dispatch(setIconSelectList(iconList));
};

export default iconSelectSlice.reducer;
