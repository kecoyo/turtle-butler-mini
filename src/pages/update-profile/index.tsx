import { Gender } from '@/common/enums';
import { getEnumOptions } from '@/common/utils';
import AreaPicker from '@/components/area-picker';
import Avatar from '@/components/avatar';
import DatePicker from '@/components/date-picker';
import ListItem from '@/components/list-item';
import SelectPicker from '@/components/select-picker';
import TextPicker from '@/components/text-picker';
import Upload from '@/components/upload';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { globalSelector } from '@/redux/reducers/global';
import { Input, Textarea, View } from '@tarojs/components';
import { useMemoizedFn, useMount, useUnmount, useUpdateEffect } from 'ahooks';
import _ from 'lodash';
import { AtList } from 'taro-ui';
import './index.scss';
import { clearUpdateProfileState, setUpdateProfileState, updateBaseInfoAsync, updateProfileSelector } from './reducer';

const classPrefix = 'lj-update-profile-page';

/**
 * 修改个人资料
 */
const UpdateProfile = () => {
  const dispatch = useAppDispatch();
  const { name, phone, code, avatar, gender, birthday, email, idCard, province, city, county, remark } = useAppSelector(updateProfileSelector);
  const { userInfo, allAreaMap } = useAppSelector(globalSelector);
  const config = useAppSelector(configSelector);
  const areaNames = [province, city, county].filter((id) => id).map((id) => allAreaMap[id].name);
  // ;

  useMount(() => {
    if (userInfo) {
      dispatch(setUpdateProfileState(_.pick(userInfo, Object.keys({ name, phone, avatar, gender, birthday, email, idCard, province, city, county, remark }))));
    }
  });

  useUpdateEffect(() => {
    if (userInfo) {
      dispatch(setUpdateProfileState(_.pick(userInfo, Object.keys({ name, phone, avatar, gender, birthday, email, idCard, province, city, county, remark }))));
    }
  }, [userInfo]);

  useUnmount(() => {
    dispatch(clearUpdateProfileState());
  });

  const onNameChange = useMemoizedFn((val: string) => dispatch(updateBaseInfoAsync({ name: val })));
  const onAvatarChange = useMemoizedFn((val: string) => dispatch(updateBaseInfoAsync({ avatar: val })));
  const onGenderChange = useMemoizedFn((val) => dispatch(updateBaseInfoAsync({ gender: val })));
  const onBirthdayChange = useMemoizedFn((val) => dispatch(updateBaseInfoAsync({ birthday: val })));
  const onAreaChange = useMemoizedFn((val) => dispatch(updateBaseInfoAsync({ province: val[0].id, city: val[1].id, county: val[2].id })));
  const onRemarkChange = useMemoizedFn((val: string) => dispatch(updateBaseInfoAsync({ remark: val })));

  return (
    <View className={classPrefix}>
      <Input style={{ display: 'none' }} />
      <Textarea style={{ display: 'none' }} />
      <AtList>
        <Upload tags="avatar" onChange={onAvatarChange}>
          <ListItem title="头像" extra={<Avatar image={avatar} circle />} />
        </Upload>
        <TextPicker type="input" title="姓名" maxLength={50} require value={name} onChange={onNameChange}>
          <ListItem title="姓名" extra={<View className="user-name">{name}</View>} />
        </TextPicker>
        <SelectPicker options={getEnumOptions(Gender)} value={gender} onChange={onGenderChange}>
          <ListItem title="性别" extra={Gender[gender]} />
        </SelectPicker>
        <DatePicker value={birthday} onChange={onBirthdayChange}>
          <ListItem title="生日" extra={birthday} />
        </DatePicker>
        <AreaPicker onChange={onAreaChange}>
          <ListItem title="地区" extra={areaNames.join('/')} />
        </AreaPicker>
        <TextPicker type="textarea" title="个性签名" maxLength={200} value={remark} onChange={onRemarkChange}>
          <ListItem title="个性签名" extra={<View className="user-remark">{remark}</View>} />
        </TextPicker>
      </AtList>
    </View>
  );
};

export default UpdateProfile;
