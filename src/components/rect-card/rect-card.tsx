import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Image, View } from '@tarojs/components';
import classNames from 'classnames';
import './rect-card.scss';

type Props = {
  image: string;
  text: string;
  type?: 'square' | 'rect';
  onClick?: () => void;
} & NativeProps;

const defaultProps = {
  type: 'square',
};

const classPrefix = `lj-rect-card`;

const RectCard: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, classPrefix + '-' + props.type)} onClick={props.onClick}>
      <Image src={props.image} className="icon"></Image>
      <View>{props.text}</View>
    </View>,
  );
};

export default RectCard;
