import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Icon from '../icon';
import './list-item.scss';

type ListItemProps = {
  icon?: string | ReactNode; // 元素的Icon
  title?: string; // 元素的标题
  note?: string; // 元素的描述信息
  extra?: string | ReactNode; // 额外信息的文本
  arrow?: 'none' | 'right' | 'down' | 'left' | 'up'; // 箭头的方向
  hasBorder?: boolean; // 是否有边框
  disabled?: boolean; // 是否禁用
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
  onLongPress?: CommonEventFunction; // 用户点击元素触发的事件
} & NativeProps;

const defaultProps = {
  arrow: 'right',
  hasBorder: true,
};

const classPrefix = `lj-list-item`;

const ListItem: React.FC<ListItemProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        'has-border': props.hasBorder,
      })}
      onClick={props.onClick}
      onLongPress={props.onLongPress}
    >
      {props.icon && <View className={`${classPrefix}--item-icon`}>{typeof props.icon === 'string' ? <Icon value={props.icon} /> : props.icon}</View>}
      <View className={`${classPrefix}--item-content`}>
        <View className={`${classPrefix}--item-title`}>{props.title}</View>
        {props.note && <View className={`${classPrefix}--item-note`}>{props.note}</View>}
      </View>
      {props.extra && <View className={`${classPrefix}--item-extra`}>{props.extra}</View>}
      {props.arrow !== 'none' && (
        <View className={`${classPrefix}--item-arrow`}>
          <Icon value={`${props.arrow}`} prefixClass="iconfont" size="small" />
        </View>
      )}
    </View>,
  );
};

export default ListItem;
