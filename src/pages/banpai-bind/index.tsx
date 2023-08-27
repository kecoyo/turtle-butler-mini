import { DeviceType } from '@/common/enums';
import { getEnumOptions } from '@/common/utils';
import AreaSelect from '@/components/area-select';
import Button from '@/components/button';
import Divider from '@/components/divider';
import Footer from '@/components/footer';
import Input from '@/components/input';
import PictureUpload from '@/components/picture-upload';
import RadioGroup from '@/components/radio-group';
import Space from '@/components/space';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { globalSelector } from '@/redux/reducers/global';
import { View } from '@tarojs/components';
import { useMemoizedFn, useUnmount } from 'ahooks';
import './index.scss';
import { banpaiBindSelector, clearBanpaiBindState, setBanpaiBindState } from './reducer';

const classPrefix = 'lj-banpai-bind-page';

/**
 * 班牌绑定
 */
const BanpaiBind = () => {
  const dispatch = useAppDispatch();
  const { installPicture, envPicture } = useAppSelector(banpaiBindSelector);
  const { allGrades } = useAppSelector(globalSelector);
  const config = useAppSelector(configSelector);

  // useMount(() => {
  //   onScanCode(6);
  // });

  useUnmount(() => {
    dispatch(clearBanpaiBindState());
  });

  const onInstallPictureChange = useMemoizedFn((val: string) => dispatch(setBanpaiBindState({ installPicture: val })));
  const onEnvPictureChange = useMemoizedFn((val: string) => dispatch(setBanpaiBindState({ envPicture: val })));

  return (
    <View className={classPrefix}>
      <View className={`${classPrefix}--scan-success`}>
        <Space className="device-scan-info" direction="column" alignItems="center" size="small">
          <View className="info-title">设备扫码成功</View>
          <View>设备序列号</View>
          <View>654867df987asdfsdf457</View>
        </Space>

        <Space className="bind-info" direction="column">
          <AreaSelect placeholder="请选择区域"  full/>
          <Input placeholder="请填写设备名称，15字以内" />
          <RadioGroup options={getEnumOptions(DeviceType)} />
        </Space>

        <Divider height={120} content="安装完成后照片" />

        <Space className="bind-info" justifyContent="center" size="larger">
          <PictureUpload title="上传安装照" value={installPicture} onChange={onInstallPictureChange} />
          <PictureUpload title="上传环境照" value={envPicture} onChange={onEnvPictureChange} />
        </Space>
      </View>

      <View className={`${classPrefix}--scan-fail`}>
        <Space className="device-scan-info" direction="column" alignItems="center" size="small">
          <View className="info-title">提示</View>
          <View>设备序列号</View>
          <View>654867df987asdfsdf457</View>
          <View className="error-info">已经被他人绑定成功</View>
        </Space>
      </View>

      <Footer>
        <Button type="primary" full size="large">
          确认绑定
        </Button>
      </Footer>
    </View>
  );
};

export default BanpaiBind;
