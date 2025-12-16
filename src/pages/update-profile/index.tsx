import { Gender } from '@/common/enums';
import { getEnumOptions, processImageUrl } from '@/common/utils';
import AreaPicker from '@/components/area-picker';
import { Avatar } from '@nutui/nutui-react-taro';
import DatePicker from '@/components/date-picker';
import ListItem from '@/components/list-item';
import SelectPicker from '@/components/select-picker';
import TextPicker from '@/components/text-picker';
import Upload from '@/components/upload';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { View } from '@tarojs/components';
import { useMemoizedFn, useMount, useUnmount, useUpdateEffect } from 'ahooks';
import _ from 'lodash';
import './index.scss';
import { clearUpdateProfileState, setUpdateProfileState, updateUserInfoAsync, updateProfileSelector } from './reducer';

const classPrefix = 'lj-update-profile-page';

/**
 * 修改个人资料
 */
const UpdateProfile = () => {
  const dispatch = useAppDispatch();
  const { nickname, phone, avatar, gender, birthday, email, idCard, province, city, county, remark } = useAppSelector(updateProfileSelector);
  const { userInfo, allAreaMap } = useAppSelector(globalSelector);
  const areaNames = [province, city, county].filter((id) => id).map((id) => allAreaMap[id].name);

  useMount(() => {
    if (userInfo) {
      const userData = {
        ...userInfo,
      };
      dispatch(setUpdateProfileState(_.pick(userData, Object.keys({ nickname, phone, avatar, gender, birthday, email, idCard, province, city, county, remark }))));
    }
  });

  useUpdateEffect(() => {
    if (userInfo) {
      const userData = {
        ...userInfo,
      };
      dispatch(setUpdateProfileState(_.pick(userData, Object.keys({ nickname, phone, avatar, gender, birthday, email, idCard, province, city, county, remark }))));
    }
  }, [userInfo]);

  useUnmount(() => {
    dispatch(clearUpdateProfileState());
  });

  const onNicknameChange = useMemoizedFn((val: string) => dispatch(updateUserInfoAsync({ nickname: val })));
  const onAvatarChange = useMemoizedFn((val: string) => dispatch(updateUserInfoAsync({ avatar: val })));
  const onGenderChange = useMemoizedFn((val) => dispatch(updateUserInfoAsync({ gender: val })));
  const onBirthdayChange = useMemoizedFn((val) => dispatch(updateUserInfoAsync({ birthday: val })));
  const onAreaChange = useMemoizedFn((val) => dispatch(updateUserInfoAsync({ province: val[0].id, city: val[1].id, county: val[2].id })));
  const onRemarkChange = useMemoizedFn((val: string) => dispatch(updateUserInfoAsync({ remark: val })));
  return (
    <View className={classPrefix}>
      <View>
        <Upload tags="user_avatar" onChange={onAvatarChange}>
          <ListItem title="头像" extra={<Avatar src={processImageUrl(avatar)} />} />
        </Upload>
        <TextPicker type="input" title="昵称" maxLength={50} require value={nickname} onChange={onNicknameChange}>
          <ListItem title="昵称" extra={<View className="user-name">{nickname}</View>} />
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
      </View>
    </View>
  );
};

export default UpdateProfile;
