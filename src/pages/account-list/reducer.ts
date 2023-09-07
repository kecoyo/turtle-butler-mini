import accountApi from '@/apis/accountApi';
import { showToast } from '@/common/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountListState {
  list: AccountInfo[]; // 账号列表
}

// 使用该类型定义初始 state
const initialState: AccountListState = {
  list: [],
};

export const accountListSlice = createSlice({
  name: 'accountList',
  initialState: initialState,
  reducers: {
    // set state
    setAccountListState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountListState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置账号列表
    setAccountList: (state, action) => {
      let list = action.payload;
      const accountList: AccountInfo[] = list.map((item: any) => ({
        ...item,
      }));
      state.list = accountList;
    },

    // 关闭列表项的SwipeAction
    setSwipeActionOpened: (state, action) => {
      for (let i = 0; i < state.list.length; i++) {
        const item = state.list[i];
        item.isOpened = i === action.payload;
      }
    },
    // 打开列表项的SwipeAction
    setSwipeActionClosed: (state, action) => {
      let index = action.payload;
      state.list[index].isOpened = false;
    },
  },
});

export const { setAccountListState, clearAccountListState, setAccountList, setSwipeActionOpened, setSwipeActionClosed } = accountListSlice.actions;
export const accountListSelector = (state: RootState) => state.accountList;

/**
 *  获取账号列表
 */
export const fetchAccountList = (categoryId: number) => async (dispatch: AppDispatch) => {
  let list = await accountApi.getAccountList({
    categoryId,
  });
  dispatch(setAccountList(list));
};

/**
 * 删除账号
 */
export const deleteAccountAsync = (id: number) => async (dispatch: AppDispatch) => {
  await accountApi.deleteAccount({ id });
  showToast('删除成功');
};
export default accountListSlice.reducer;
