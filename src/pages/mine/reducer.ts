import { RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';

// 为 slice state 定义一个类型
interface MineState {
  value: number;
}

// 使用该类型定义初始 state
const initialState: MineState = {
  value: 0,
};

export const mineSlice = createSlice({
  name: 'mine',
  initialState: initialState,
  reducers: {
    // set state
    setMineState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear state
    clearMineState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setMineState, clearMineState } = mineSlice.actions;
export const mineSelector = (state: RootState) => state.mine;

export default mineSlice.reducer;
