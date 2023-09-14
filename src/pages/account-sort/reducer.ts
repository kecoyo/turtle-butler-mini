import accountApi from '@/apis/accountApi';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountSortState {
  list: AccountInfo[]; // 账号列表
}

// 使用该类型定义初始 state
const initialState: AccountSortState = {
  list: [],
};

export const accountSortSlice = createSlice({
  name: 'accountSort',
  initialState: initialState,
  reducers: {
    // set state
    setAccountSortState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountSortState: (state) => {
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

    // 排序账号列表
    sortAccountList: (state, action) => {
      const { startIndex, toIndex } = action.payload;
      let item = state.list[startIndex];
      state.list.splice(startIndex, 1);
      state.list.splice(toIndex, 0, item);
    },
  },
});

export const { setAccountSortState, clearAccountSortState, setAccountList, sortAccountList } = accountSortSlice.actions;
export const accountSortSelector = (state: RootState) => state.accountSort;

/**
 *  获取账号列表
 */
export const fetchAccountList = (categoryId: number) => async (dispatch: AppDispatch) => {
  let list = await accountApi.getAccountList({
    categoryId,
  });
  dispatch(setAccountList(list));
};

export default accountSortSlice.reducer;
