import { JoinSchoolApplyStatus } from '@/common/enums';
import { getConfigUrl, showConfirm, showToast } from '@/common/utils';
import AuthCheck from '@/components/auth-check';
import Button from '@/components/button';
import Empty from '@/components/empty';
import SendCodeModal from '@/components/send-code-modal';
import Space from '@/components/space';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { globalSelector } from '@/redux/reducers/global';
import { Image, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import './index.scss';
import { cancelApplyAsync, closeSendCodeModal, fetchJoinSchoolApplyInfo, myTaskSelector, openSendCodeModal, quitSchoolAsync } from './reducer';

const classPrefix = 'lj-my-task-page';

/**
 * 我的任务
 */
const MyTask = () => {
  const dispatch = useAppDispatch();
  const { userInfo, schoolInfo } = useAppSelector(globalSelector);
  const { applyInfo, sendCodeModalVisible } = useAppSelector(myTaskSelector);
  const config = useAppSelector(configSelector);

  useMount(() => {
    if (userInfo) {
      dispatch(fetchJoinSchoolApplyInfo());
    }
  });
  useUpdateEffect(() => {
    dispatch(fetchJoinSchoolApplyInfo());
  }, [userInfo]);

  // 退出学校，发送验证码成功
  const onSendCodeOk = useMemoizedFn((code: string) => {
    dispatch(closeSendCodeModal());
    if (userInfo) {
      dispatch(quitSchoolAsync(userInfo.phone, code));
    }
  });

  const onSendCodeCancel = useMemoizedFn(() => {
    dispatch(closeSendCodeModal());
  });

  // 取消申请
  const onCancelApply = useMemoizedFn(() => {
    showConfirm({
      content: '您确定要放弃申请吗？',
      onOk: () => {
        dispatch(cancelApplyAsync());
      },
    });
  });

  return (
    <View className={classPrefix}>
      <Image className="bg-image" src={getConfigUrl(config.school.bg_png)} mode="aspectFill" />
      <View className="container">
        {!schoolInfo && !applyInfo && (
          <View className="no-school-info-box">
            <Empty />
            <Space className="button-wrap" justifyContent="center">
              <Button type="primary" circle onClick={() => Taro.navigateTo({ url: '/pages/join-school/index' })}>
                申请加入学校
              </Button>
            </Space>
            <Space className="tip-wrap" justifyContent="center">
              注：每月仅限申请3次
            </Space>
          </View>
        )}

        {schoolInfo && (
          <View className="school-info-box">
            <View className="school-name">{schoolInfo.name}</View>
            <View>
              <Space justifyContent="space-around">
                <Button circle onClick={() => dispatch(openSendCodeModal())}>
                  退出学校
                </Button>
                <Button circle onClick={() => showToast('邀请老师')}>
                  邀请老师
                </Button>
                <AuthCheck allowRoles={[3]}>
                  <Button type="primary" circle onClick={() => Taro.navigateTo({ url: '/pages/class-manage/index' })}>
                    班级管理
                  </Button>
                </AuthCheck>
              </Space>
            </View>
          </View>
        )}

        {applyInfo && (
          <View className="apply-info-box">
            <View className="tip-title">提示</View>
            <View className="tip-content">
              {applyInfo.status === JoinSchoolApplyStatus.未处理 ? (
                <Text>请等待学校管理员审核</Text>
              ) : applyInfo.status === JoinSchoolApplyStatus.已通过 ? (
                <Text>您的入校申请已通过</Text>
              ) : (
                <Text className="error-text">您的入校申请被学校管理员拒绝</Text>
              )}
            </View>
            <View className="school-name">{applyInfo.schoolName}</View>
            <Space justifyContent="center">
              {applyInfo.status === JoinSchoolApplyStatus.未处理 ? (
                <Button circle onClick={onCancelApply}>
                  放弃申请
                </Button>
              ) : applyInfo.status === JoinSchoolApplyStatus.已拒绝 ? (
                <Button circle onClick={() => Taro.navigateTo({ url: '/pages/join-school/index' })}>
                  重新申请
                </Button>
              ) : null}
            </Space>
          </View>
        )}
      </View>

      {sendCodeModalVisible && (
        <SendCodeModal
          visible={sendCodeModalVisible} //
          phone={userInfo?.phone}
          onCancel={onSendCodeCancel}
          onOk={onSendCodeOk}
        />
      )}
    </View>
  );
};

export default MyTask;
