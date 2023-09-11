import accountApi from '@/apis/accountApi';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountDetailState {
  account?: AccountInfo; // 账号信息
}

// 使用该类型定义初始 state
const initialState: AccountDetailState = {
  account: undefined,
};

export const accountDetailSlice = createSlice({
  name: 'accountDetail',
  initialState: initialState,
  reducers: {
    // set state
    setAccountDetailState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountDetailState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setAccountDetailState, clearAccountDetailState } = accountDetailSlice.actions;
export const accountDetailSelector = (state: RootState) => state.accountDetail;

/**
 * 获取账号信息
 */
export const fetchAccountInfo = (id: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const info = await accountApi.getAccountInfo({ id });
  dispatch(setAccountDetailState({ account: info }));
};

export default accountDetailSlice.reducer;
