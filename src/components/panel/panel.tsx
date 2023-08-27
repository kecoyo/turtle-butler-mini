import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Icon from '../icon';
import ImageIcon from '../image-icon';
import './panel.scss';

type PanelProps = {
  image?: string | ReactNode; // 元素的缩略图
  icon?: string | ReactNode; // 元素的Icon
  block?: boolean; // 元素的标记
  title?: string; // 元素的标题
  extra?: string | ReactNode; // 额外信息的文本
  arrow?: 'none' | 'right' | 'down' | 'left' | 'up'; // 箭头的方向
  disabled?: boolean; // 是否禁用
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
  children?: string | ReactNode;
} & NativeProps;

const defaultProps = {
  block: true,
  arrow: 'none',
};

const classPrefix = `lj-panel`;

const Panel: React.FC<PanelProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, {})} onClick={props.onClick}>
      {props.title && (
        <View className={`${classPrefix}--header`}>
          {props.image && <View className={`${classPrefix}--item-image`}>{typeof props.image === 'string' ? <ImageIcon src={props.image} /> : props.image}</View>}
          {props.icon && <View className={`${classPrefix}--item-icon`}>{typeof props.icon === 'string' ? <Icon value={props.icon} /> : props.icon}</View>}
          {props.block && <View className={`${classPrefix}--item-block`}></View>}
          <View className={`${classPrefix}--item-title`}>{props.title}</View>
          {props.extra && <View className={`${classPrefix}--item-extra`}>{props.extra}</View>}
        </View>
      )}
      <View className={`${classPrefix}--content`}>{props.children}</View>
    </View>,
  );
};

export default Panel;
