import accountApi from '@/apis/accountApi';
import { showConfirm, showToast } from '@/common/utils';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import { setCategoryListDataChanged } from '../category-list/reducer';

// 为 slice state 定义一个类型
interface AccountListState {
  list: AccountInfo[]; // 账号列表

  // more actionsheet
  moreOpened: boolean;
  moreItem?: AccountInfo;
  moreItemIndex?: number;

  // 数据已经变化，需要刷新
  dataChanged: boolean;
}

// 使用该类型定义初始 state
const initialState: AccountListState = {
  list: [],

  moreOpened: false,
  moreItem: undefined,
  moreItemIndex: undefined,

  dataChanged: false,
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
      state.dataChanged = false;
    },

    // 设置账号列表数据改变了，需要刷新
    setAccountListDataChanged: (state) => {
      state.dataChanged = true;
    },

    // 删除账号
    deleteAccount: (state, action) => {
      let id = action.payload;
      let index = state.list.findIndex((item) => item.id === id);
      if (index >= 0) {
        state.list.splice(index, 1);
      }
    },

    // 打开MoreActionSheet
    openMoreActionSheet: (state, action) => {
      const { item, index } = action.payload;
      state.moreOpened = true;
      state.moreItem = item;
      state.moreItemIndex = index;
    },

    // 关闭MoreActionSheet
    closeMoreActionSheet: (state) => {
      state.moreOpened = false;
      state.moreItem = undefined;
      state.moreItemIndex = undefined;
    },
  },
});

export const { setAccountListState, clearAccountListState, setAccountList, setAccountListDataChanged, deleteAccount, openMoreActionSheet, closeMoreActionSheet } =
  accountListSlice.actions;
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
  await new Promise((resolve, reject) => {
    showConfirm({
      content: '您确定要删除该账号吗？',
      onOk: async () => {
        await accountApi.deleteAccount({ id });
        await showToast('删除成功');

        dispatch(deleteAccount(id));
        // 添加了新账号，需要刷新分类列表中账号数量
        dispatch(setCategoryListDataChanged());

        resolve(true);
      },
    });
  });
};
export default accountListSlice.reducer;
