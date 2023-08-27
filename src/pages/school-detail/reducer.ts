import classApi from '@/apis/classApi';
import { showModal } from '@/common/utils';
import { AppDispatch, AppGetState, RootState } from '@/redux/store';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import _ from 'lodash';

export interface SchoolDetailInfo extends ClassInfo {
  yearBorn: number;
  yearGrad: number;
}

// 为 slice state 定义一个类型
interface SchoolDetailState {
  detail: SchoolDetailInfo | null; // 班级信息
  teacherList: TeacherInfo[]; // 教师列表
  studentList: StudentInfo[]; // 班级学生列表

  // 邀请弹框
  inviteModalVisible: boolean; // 显示弹框

  // 转让班主任弹框
  changeMasterModalVisible: boolean; // 显示弹框
  changeMaster?: TeacherInfo; // 现任班主任
  changeMasterList: TeacherInfo[]; // 待转让老师列表

  // 转换班级弹框
  changeClassModalVisible?: boolean; // 显示弹框
  changeClassValue?: { gradeId: number; classId: number }; // 待转让老师列表
  changeClassStudent?: StudentInfo; // 转换班级的学生

  // 数据已改变，需要更新上级页面
  schoolDetailDataChanged?: false;
}

// 使用该类型定义初始 state
const initialState: SchoolDetailState = {
  detail: null,
  teacherList: [],
  studentList: [],

  inviteModalVisible: false,
  changeMasterModalVisible: false,
  changeMasterList: [],

  changeClassModalVisible: false,
  changeClassValue: undefined,
  changeClassStudent: undefined,
};

export const schoolDetailSlice = createSlice({
  name: 'schoolDetail',
  initialState: initialState,
  reducers: {
    // setter
    setSchoolDetailState: (state, action) => {
      Object.assign(state, action.payload);
    },
    // clear
    clearSchoolDetailState: (state) => {
      Object.assign(state, initialState);
    },
    // 打开邀请弹框
    openInviteModal: (state) => {
      state.inviteModalVisible = true;
    },
    // 关闭邀请弹框
    closeInviteModal: (state) => {
      state.inviteModalVisible = false;
    },
    // 打开转让班主任弹框
    openChangeMasterModal: (state, action) => {
      const { changeMaster, changeMasterList } = action.payload;
      state.changeMasterModalVisible = true;
      state.changeMaster = changeMaster;
      state.changeMasterList = changeMasterList;
    },
    // 关闭转让班主任弹框
    closeChangeMasterModal: (state) => {
      state.changeMasterModalVisible = false;
      state.changeMaster = undefined;
      state.changeMasterList = [];
    },
    // 转让班主任
    changeMaster: (state, action) => {
      const { targetId } = action.payload;
      state.teacherList.forEach((item) => {
        if (item.id === targetId) {
          item.isMaster = true;
        } else {
          item.isMaster = false;
        }
      });
    },
    // 从班级里移出老师
    removeTeacher: (state, action) => {
      const { teacherId } = action.payload;
      _.remove(state.teacherList, { id: teacherId });
    },
    // 打开转换班级弹框
    openChangeClassModal: (state, action) => {
      const { changeClassStudent, changeClassValue } = action.payload;
      state.changeClassModalVisible = true;
      state.changeClassStudent = changeClassStudent;
      state.changeClassValue = changeClassValue;
    },
    // 关闭转换班级弹框
    closeChangeClassModal: (state) => {
      state.changeClassModalVisible = false;
      state.changeClassStudent = undefined;
      state.changeClassValue = undefined;
    },
    // 从班级中移除学生
    removeStudent: (state, action) => {
      const { studentId } = action.payload;
      _.remove(state.studentList, { id: studentId });
    },
    // 设置是否是需要更新上级页面
    setSchoolDetailDataChanged: (state, action) => {
      state.schoolDetailDataChanged = action.payload;
    },
  },
});

export const {
  setSchoolDetailState,
  clearSchoolDetailState,
  openInviteModal,
  closeInviteModal,
  openChangeMasterModal,
  closeChangeMasterModal,
  changeMaster,
  removeTeacher,
  openChangeClassModal,
  closeChangeClassModal,
  removeStudent,
  setSchoolDetailDataChanged,
} = schoolDetailSlice.actions;
export const schoolDetailSelector = (state: RootState) => state.schoolDetail;

/**
 * 获取学校详情
 */
export const fetchSchoolDetail = (id: number) => async (dispatch: AppDispatch, getState: AppGetState) => {
  const { allGradeMap } = getState().global;
  let data = await classApi.getClassInfoById({ classId: id });

  let detail: SchoolDetailInfo = {
    ..._.pick(data, ['id', 'name', 'gradeId', 'yearBorn', 'yearGrad']),
    gradeName: allGradeMap[data.gradeId]?.name || '',
  };

  // 班主任id，有多个
  let adminIds = data.admin.map((t: any) => t.userId);

  let teacherList = data.teacherInfo.map(
    (t: any): TeacherInfo => ({
      ..._.pick(t, ['name', 'avatar', 'phone']),
      id: t.userId,
      isMaster: adminIds.includes(t.userId),
    }),
  );

  let studentList = (data.studentInfo || []).map(
    (s: any): StudentInfo => ({
      ..._.pick(s, ['name', 'avatar', 'phone', 'parents']),
      id: s.userId,
      parents: s.parents.map(
        (p: any): ParentInfo => ({
          ..._.pick(p, ['name', 'avatar', 'phone']),
          id: p.parentId,
          name: p.showName,
        }),
      ),
    }),
  );

  dispatch(
    setSchoolDetailState({
      detail: detail,
      teacherList: teacherList,
      studentList: studentList,
    }),
  );
};

/**
 * 解散班级
 */
export const dissolveClassAsync = (id: number) => async (dispatch: AppDispatch) => {
  await classApi.dissolveClass({ classId: id });

  showModal({
    content: '解散成功',
    onOk: () => {
      dispatch(setSchoolDetailDataChanged(true));
      Taro.navigateBack();
    },
  });
};

/**
 * 转让班主任
 */
export const changeMasterAsync = (data: { classId: number; userId: number; targetId: number }) => async (dispatch: AppDispatch) => {
  await classApi.transferCharge({
    classId: data.classId, // 班级id
    userId: data.userId, // 班主任id
    targetId: data.targetId, // 转让目标id
  });

  showModal({
    content: '转让成功',
    onOk: () => {
      dispatch(changeMaster({ targetId: data.targetId }));
      dispatch(setSchoolDetailDataChanged(true));
    },
  });
};

/**
 * 从班级里移出老师
 */
export const removeTeacherAsync = (data: { classId: number; teacherId: number }) => async (dispatch: AppDispatch) => {
  await classApi.quitClass({
    classId: data.classId, // 班级id
    targetId: data.teacherId, // 目标用户id
  });

  showModal({
    content: '移出成功',
    onOk: () => {
      // 展示数据，从当前班级中移除老师
      dispatch(removeTeacher({ teacherId: data.teacherId }));
      dispatch(setSchoolDetailDataChanged(true));
    },
  });
};

/**
 * 学生转移班级
 */
export const changeClassAsync = (data: { classId: number; userId: number; targetClassId: number }) => async (dispatch: AppDispatch) => {
  if (data.classId === data.targetClassId) {
    throw new Error('请选择其他班级');
  }

  await classApi.changeClass({
    classId: data.classId, // 班级id
    userId: data.userId, // 学生id
    targetClass: data.targetClassId, // 转让目标班级id
  });

  showModal({
    content: '转移成功',
    onOk: () => {
      // 展示数据，从当前班级中移除学生即可
      dispatch(removeStudent({ studentId: data.userId }));
      dispatch(setSchoolDetailDataChanged(true));
    },
  });
};

export default schoolDetailSlice.reducer;
