import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import './footer.scss';

type Props = {
  children?: React.ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-footer';

const Footer: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(props, <View className={classPrefix}>{props.children}</View>);
};

export default Footer;
