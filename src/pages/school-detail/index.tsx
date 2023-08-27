import { getConfigUrl, showConfirm, showErrorMsg, showToast } from '@/common/utils';
import AuthCheck from '@/components/auth-check';
import Button from '@/components/button';
import ClassSelectModal from '@/components/class-select-modal';
import Modal from '@/components/modal';
import SelectModal from '@/components/select-modal';
import Space from '@/components/space';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { Image, Text, View } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import StudentItem from './components/student-item';
import TeacherItem from './components/teacher-item';
import './index.scss';
import {
  changeClassAsync,
  changeMasterAsync,
  schoolDetailSelector,
  clearSchoolDetailState,
  closeChangeClassModal,
  closeChangeMasterModal,
  closeInviteModal,
  dissolveClassAsync,
  fetchSchoolDetail,
  openChangeClassModal,
  openChangeMasterModal,
  openInviteModal,
  removeTeacherAsync,
} from './reducer';

const classPrefix = 'lj-school-detail-page';

/**
 * 学校详情
 */
const SchoolDetail = () => {
  const dispatch = useAppDispatch();
  const {
    detail,
    teacherList,
    studentList,
    inviteModalVisible,
    changeMasterModalVisible,
    changeMaster,
    changeMasterList,
    changeClassModalVisible,
    changeClassStudent,
    changeClassValue,
  } = useAppSelector(schoolDetailSelector);
  const config = useAppSelector(configSelector);
  const router = useRouter();

  const teacherNum = teacherList?.length || 0;
  const studentNum = studentList?.length || 0;
  const parentNum = studentList ? studentList.map((stu) => stu.parents?.length || 0).reduce((prev, curr) => prev + curr, 0) : 0;

  useMount(() => {
    const { id } = router.params;
    if (id) {
      dispatch(fetchSchoolDetail(Number(id)));
    }
  });

  useUnmount(() => {
    dispatch(clearSchoolDetailState());
  });

  // 解散班级
  const onDissolveClass = useMemoizedFn(() => {
    showConfirm({
      content: '您确认要解散班级吗？',
      onOk: async () => {
        if (detail) {
          dispatch(dissolveClassAsync(detail.id));
        }
      },
    });
  });

  // 移出老师
  const onRemoveTeacher = useMemoizedFn((item: TeacherInfo) => {
    showConfirm({
      content: '您确认要移出“' + item.name + '”吗？',
      onOk: async () => {
        onRemoveTeacherSelectOk(item.id);
      },
    });
  });

  // 移出老师，确认
  const onRemoveTeacherSelectOk = useMemoizedFn(async (teacherId: number) => {
    try {
      if (detail) {
        dispatch(removeTeacherAsync({ classId: detail.id, teacherId }));
      }
    } catch (err) {
      showErrorMsg(err);
    }
  });

  // 转让班主任
  const onChangeMaster = useMemoizedFn((item: TeacherInfo) => {
    let list = teacherList?.filter((t) => t.id !== item.id);
    if (!list || list.length === 0) {
      showToast('没有可选老师');
      return;
    }
    dispatch(openChangeMasterModal({ changeMaster: item, changeMasterList: list }));
  });

  // 转让班主任，确认
  const onChangeMasterSelectOk = useMemoizedFn(async (values: number[]) => {
    try {
      if (detail && changeMaster && values[0]) {
        await dispatch(changeMasterAsync({ classId: detail.id, userId: changeMaster.id, targetId: values[0] }));
        await dispatch(closeChangeMasterModal());
      }
    } catch (err) {
      showErrorMsg(err);
    }
  });

  // 学生转移班级
  const onChangeClass = useMemoizedFn((item: StudentInfo) => {
    if (detail) {
      dispatch(
        openChangeClassModal({
          changeClassStudent: item,
          changeClassValue: { gradeId: detail.gradeId, classId: detail.id },
        }),
      );
    }
  });

  // 学生转移班级，确认
  const onChangeClassSelectOk = useMemoizedFn(async (value: { gradeId: number; classId: number }) => {
    try {
      if (detail && changeClassStudent && value) {
        await dispatch(changeClassAsync({ classId: detail.id, userId: changeClassStudent.id, targetClassId: value.classId }));
        await dispatch(closeChangeClassModal());
      }
    } catch (err) {
      showErrorMsg(err);
    }
  });

  return (
    <View className={classPrefix}>
      <Image className="bg-image" src={getConfigUrl(config.school.bg_png)} mode="aspectFill" />
      {detail && (
        <View className="container">
          <View className="class-info-box">
            <View className="class-name">{detail.name}</View>
            <View className="class-year">{detail.yearBorn}届</View>
            <View>
              <Space justifyContent="space-around">
                <AuthCheck allowRoles={[3]}>
                  <Button circle onClick={onDissolveClass}>
                    解散班级
                  </Button>
                </AuthCheck>
                <Button circle onClick={() => dispatch(openInviteModal())}>
                  邀请老师
                </Button>
              </Space>
            </View>
          </View>

          <View className="teacher-list-box">
            <View className="teacher-list-header">教师：{teacherNum}人</View>
            <View className="teacher-list">
              {teacherList?.map((item, index) => (
                <TeacherItem key={index} item={item} isMaster={false} onChangeMaster={onChangeMaster} onRemoveTeacher={onRemoveTeacher} />
              ))}
            </View>
          </View>

          <View className="student-list-box">
            <View className="student-list-header">
              <Space>
                <Text>学生：{studentNum}人 </Text>
                <Text>家长：{parentNum}人</Text>
              </Space>
            </View>
            <View className="student-list">
              {studentList?.map((item, index) => (
                <StudentItem key={index} item={item} onChangeClass={onChangeClass} />
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 邀请加入弹框 */}
      <Modal className="invert-modal" visible={inviteModalVisible} title="请选择要邀请的身份" cancelText="关闭" onCancel={() => dispatch(closeInviteModal())}>
        <View className="invert-modal-content">
          <Image src={getConfigUrl(config.others.invert_teacher_png)} mode="heightFix" onClick={() => showToast('去邀请教师')} />
          <Image src={getConfigUrl(config.others.invert_parent_png)} mode="heightFix" onClick={() => showToast('去邀请家长')} />
        </View>
      </Modal>

      {/* 转让班主任弹框 */}
      <SelectModal
        title="请选择要转让的教师"
        visible={changeMasterModalVisible}
        options={changeMasterList.map((t: TeacherInfo) => ({ value: t.id, label: t.name }))}
        onCancel={() => dispatch(closeChangeMasterModal())}
        onOk={onChangeMasterSelectOk}
      />

      {/* 学生转移班级弹框 */}
      {detail && (
        <ClassSelectModal
          title="请选择要转移的班级" //
          value={changeClassValue}
          visible={changeClassModalVisible}
          onCancel={() => dispatch(closeChangeClassModal())}
          onOk={onChangeClassSelectOk}
        />
      )}
    </View>
  );
};

export default SchoolDetail;
