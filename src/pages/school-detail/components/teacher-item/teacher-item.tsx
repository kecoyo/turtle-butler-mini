import { NativeProps, withNativeProps } from '@/common/native-props';
import { getConfigUrl, makePhoneCall } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import AuthCheck from '@/components/auth-check';
import Avatar from '@/components/avatar';
import ImageIcon from '@/components/image-icon';
import Link from '@/components/link';
import Space from '@/components/space';
import { useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { View } from '@tarojs/components';
import './teacher-item.scss';

type Props = {
  item: TeacherInfo; // 老师信息
  isMaster?: boolean; // 是班主任
  onChangeMaster: (item: TeacherInfo) => void; // 点击转让班主任
  onRemoveTeacher: (item: TeacherInfo) => void; // 点击移除老师
} & NativeProps;

const defaultProps = {
  onClick: () => undefined,
};

const classPrefix = `lj-school-detail-teacher-item`;

const TeacherItem: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);
  const config = useAppSelector(configSelector);

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <Avatar image={props.item.avatar} />
      <View className="item-info">
        <View className="item-name">{props.item.name}</View>
        <View className="item-role">{props.item.isMaster ? '班主任' : '老师'}</View>
      </View>
      <View className="item-right">
        {props.item.isMaster ? ( //
          <AuthCheck allowRoles={[3]}>
            <Link onClick={() => props.onChangeMaster(props.item)}>转换班主任</Link>
          </AuthCheck>
        ) : (
          <Space>
            <AuthCheck allowRoles={[3]}>
              <Link onClick={() => props.onRemoveTeacher(props.item)}>移出</Link>
            </AuthCheck>
            <ImageIcon src={getConfigUrl(config.others.phone_png)} onClick={() => makePhoneCall(props.item.id)} />
          </Space>
        )}
      </View>
    </View>,
  );
};

export default TeacherItem;
