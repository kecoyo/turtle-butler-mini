import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { ITouchEvent, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './space.scss';

type Props = {
  children?: ReactNode;
  size?: 'larger' | 'large' | 'normal' | 'small' | 'smaller';
  direction?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-around' | 'space-between' | 'space-evenly' | 'start' | 'end' | 'left' | 'right';
  alignItems?: 'center' | 'end' | 'flex-end' | 'flex-start' | 'self-end' | 'self-start' | 'start';
  flex?: boolean;
  onClick?: (e: ITouchEvent) => void;
} & NativeProps;

const defaultProps = {
  size: 'normal',
  direction: 'row',
};

const classPrefix = 'lj-space';

const Space: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.direction}`]: props.direction,
        [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--flex`]: props.flex,
      })} //
      style={{ justifyContent: props.justifyContent, alignItems: props.alignItems }}
      onClick={props.onClick}
    >
      {props.children}
    </View>,
  );
};

export default Space;
