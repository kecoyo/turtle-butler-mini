import categoryApi from '@/apis/categoryApi';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface AccountMoveState {
  list: CategoryInfo[]; // 分类列表

  selected?: number; // 选中的分类id
}

// 使用该类型定义初始 state
const initialState: AccountMoveState = {
  list: [],
  selected: undefined,
};

export const accountMoveSlice = createSlice({
  name: 'accountMove',
  initialState: initialState,
  reducers: {
    // set state
    setAccountMoveState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearAccountMoveState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置分类列表
    setCategoryList: (state, action) => {
      let list = action.payload;
      const categoryList: CategoryInfo[] = list.map(
        (item: any): CategoryInfo => ({
          ...item,
        }),
      );
      state.list = categoryList;
    },

    // 排序分类列表
    sortCategoryList: (state, action) => {
      const { startIndex, toIndex } = action.payload;
      let item = state.list[startIndex];
      state.list.splice(startIndex, 1);
      state.list.splice(toIndex, 0, item);
    },
  },
});

export const { setAccountMoveState, clearAccountMoveState, setCategoryList, sortCategoryList } = accountMoveSlice.actions;
export const accountMoveSelector = (state: RootState) => state.accountMove;

/**
 *  获取分类列表
 */
export const fetchCategoryList = () => async (dispatch: AppDispatch) => {
  let list = await categoryApi.getCategoryList();
  dispatch(setCategoryList(list));
};

export default accountMoveSlice.reducer;
