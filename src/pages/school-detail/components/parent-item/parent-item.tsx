import { NativeProps, withNativeProps } from '@/common/native-props';
import { getConfigUrl, makePhoneCall } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import ImageIcon from '@/components/image-icon';
import Space from '@/components/space';
import { useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { View } from '@tarojs/components';
import './parent-item.scss';

type ParentItemProps = {
  item: ParentInfo;
  onClick?: (item: ParentInfo) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-school-detail-parent-item`;

const ParentItem: React.FC<ParentItemProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const config = useAppSelector(configSelector);

  return withNativeProps(
    props,
    <Space className={classPrefix} size="small" onClick={() => makePhoneCall(props.item.id)}>
      <View className="item-parent-name">{props.item.name}</View>
      <ImageIcon src={getConfigUrl(config.others.phone_png)} />
    </Space>,
  );
};

export default ParentItem;
