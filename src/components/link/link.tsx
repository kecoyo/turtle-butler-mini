import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, Text, View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Icon from '../icon';
import './link.scss';

export type LinkProps = {
  icon?: string | ReactNode;
  text?: string;
  disabled?: boolean; // 是否禁用
  onClick?: CommonEventFunction;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-link`;

const Link: React.FC<LinkProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onClick = useMemoizedFn((e) => {
    if (props.onClick && !props.disabled) {
      props.onClick(e);
    }
  });

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--disabled`]: props.disabled,
      })}
      onClick={onClick}
    >
      {typeof props.icon === 'string' ? <Icon value={props.icon} size="small" /> : props.icon}
      {props.text && <Text className={`${classPrefix}--text`}>{props.text}</Text>}
    </View>,
  );
};

export default Link;
