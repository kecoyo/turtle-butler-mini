import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import classNames from 'classnames';
import _ from 'lodash';
import { AtButton } from 'taro-ui';
import { AtButtonProps } from 'taro-ui/types/button';
import './button.scss';

export type ButtonProps = {
  type?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  size?: 'large' | 'normal' | 'small';
  onClick?: () => void;
} & Omit<AtButtonProps, 'size' | 'type'> &
  NativeProps;

const defaultButtonProps = {
  size: 'normal',
  border: true,
};

const classPrefix = 'lj-button';

const Button: React.FC<ButtonProps> = (p) => {
  const props = mergeProps(defaultButtonProps, p);
  const otherProps = _.omit(props, ['className', 'style', 'size', 'type']);

  return withNativeProps(
    props,
    <AtButton
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.type}`]: props.type,
        [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--full`]: props.full,
        [`${classPrefix}--circle`]: props.circle,
        [`${classPrefix}--border`]: props.border,
      })}
      size={props.size === 'small' || props.size === 'normal' ? props.size : undefined}
      {...otherProps}
    >
      {props.children}
    </AtButton>,
  );
};

export default Button;
