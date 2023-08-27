import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import './split.scss';

type Props = {
  direction?: 'row' | 'column';
  size?: 'large' | 'normal' | 'small';
  onClick?: () => void;
} & NativeProps;

const defaultProps = {
  direction: 'row',
  size: 'normal',
};

const classPrefix = `lj-split`;

const Split: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.direction}`]: props.direction,
        [`${classPrefix}--${props.size}`]: props.size,
      })}
      onClick={props.onClick}
    />,
  );
};

export default Split;
