import categoryApi from '@/apis/categoryApi';
import { AppDispatch, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface CategorySortState {
  list: CategoryInfo[]; // 分类列表
}

// 使用该类型定义初始 state
const initialState: CategorySortState = {
  list: [],
};

export const categorySortSlice = createSlice({
  name: 'categorySort',
  initialState: initialState,
  reducers: {
    // set state
    setCategorySortState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearCategorySortState: (state) => {
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

export const { setCategorySortState, clearCategorySortState, setCategoryList, sortCategoryList } = categorySortSlice.actions;
export const categorySortSelector = (state: RootState) => state.categorySort;

/**
 *  获取分类列表
 */
export const fetchCategoryList = () => async (dispatch: AppDispatch) => {
  let list = await categoryApi.getCategoryList();
  dispatch(setCategoryList(list));
};

export default categorySortSlice.reducer;
