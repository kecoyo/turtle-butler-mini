import categoryApi from '@/apis/categoryApi';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface IndexState {
  list: Category[]; // 分类列表
}

// 使用该类型定义初始 state
const initialState: IndexState = {
  list: [],
};

export const indexSlice = createSlice({
  name: 'index',
  initialState: initialState,
  reducers: {
    // set state
    setIndexState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearIndexState: (state) => {
      Object.assign(state, initialState);
    },

    // 设置分类列表
    setCategoryList: (state, action) => {
      let list = action.payload;
      const categoryList: Category[] = list.map(
        (item: any): Category => ({
          ...item,
        }),
      );
      state.list = categoryList;
    },
  },
});

export const { setIndexState, clearIndexState, setCategoryList } = indexSlice.actions;
export const indexSelector = (state: RootState) => state.index;

/**
 *  获取分类列表
 */
export const fetchCategoryList = () => async (dispatch: AppDispatch) => {
  let list = await categoryApi.getCategoryList();
  dispatch(setCategoryList(list));
};

export default indexSlice.reducer;
