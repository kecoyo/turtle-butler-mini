import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction } from '@tarojs/components';
import classNames from 'classnames';
import { AtIcon } from 'taro-ui';
import './icon.scss';

export type IconProps = {
  value: string;
  type?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'large' | 'normal' | 'small';
  prefixClass?: string | 'fa';
  onClick?: CommonEventFunction;
} & NativeProps;

export const defaultProps = {
  size: 'normal',
};

const classPrefix = `lj-icon`;

const Icon: React.FC<IconProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <AtIcon
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--${props.type}`]: props.type,
      })} //
      prefixClass={props.prefixClass}
      value={props.value}
      size={0}
      onClick={props.onClick}
    />,
  );
};

export default Icon;
