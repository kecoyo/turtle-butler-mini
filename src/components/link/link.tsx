import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, Text } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './link.scss';

export type LinkProps = {
  disabled?: boolean; // 是否禁用
  onClick?: CommonEventFunction;
  children: ReactNode;
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
    <Text
      className={classNames(classPrefix, {
        [`${classPrefix}--disabled`]: props.disabled,
      })}
      onClick={onClick}
    >
      {props.children}
    </Text>,
  );
};

export default Link;
