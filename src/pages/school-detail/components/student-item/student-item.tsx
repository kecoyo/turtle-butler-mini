import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import Avatar from '@/components/avatar';
import Link from '@/components/link';
import { View } from '@tarojs/components';
import ParentItem from '../parent-item';
import './student-item.scss';

type Props = {
  item: StudentInfo;
  parents?: ParentInfo[];
  onChangeClass: (item: StudentInfo) => void; // 点击转让班主任
} & NativeProps;

const defaultProps = {
  parents: [],
};

const classPrefix = `lj-school-detail-student-item`;

const StudentItem: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <Avatar image={props.item.avatar} />
      <View className="item-info">
        <View className="item-name">
          <View className="student-name">{props.item.name}</View>
          <Link onClick={() => props.onChangeClass(props.item)}>转到其他班</Link>
        </View>
        {props.item.parents && (
          <View className="item-parents">
            {props.item.parents.map((item, i) => (
              <ParentItem key={i} item={item} />
            ))}
          </View>
        )}
      </View>
    </View>,
  );
};

export default StudentItem;
