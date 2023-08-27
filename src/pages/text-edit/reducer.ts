import { RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface TextEditState {
  type: 'input' | 'textarea';
  value: string;
  title: string;
  desc: string;
  require: boolean;
  maxLength: number;
}

// 使用该类型定义初始 state
const initialState: TextEditState = {
  type: 'input',
  value: '',
  title: '',
  desc: '',
  require: false,
  maxLength: 200,
};

export const textEditSlice = createSlice({
  name: 'textEdit',
  initialState: initialState,
  reducers: {
    // set state
    setTextEditState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearTextEditState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setTextEditState, clearTextEditState } = textEditSlice.actions;
export const textEditSelector = (state: RootState) => state.textEdit;

export default textEditSlice.reducer;
