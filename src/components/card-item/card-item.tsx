import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, Text, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Icon from '../icon';
import ImageIcon from '../image-icon';
import './card-item.scss';

type CardItemProps = {
  image?: string | ReactNode; // 元素的缩略图
  icon?: string | ReactNode; // 元素的Icon
  title?: string; // 元素的标题
  note?: string; // 元素的描述信息
  extra?: string | ReactNode; // 额外信息的文本
  isNew?: boolean; // 是否是新的
  hasArrow?: boolean; // 是否有箭头
  arrow?: 'right'; // 箭头的方向
  disabled?: boolean; // 是否禁用
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
} & NativeProps;

const defaultProps = {
  arrow: 'right',
};

const classPrefix = `lj-card-item`;

const CardItem: React.FC<CardItemProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, {})} onClick={props.onClick}>
      {props.image && <View className={`${classPrefix}--item-image`}>{typeof props.image === 'string' ? <ImageIcon src={props.image} /> : props.image}</View>}
      {props.icon && <View className={`${classPrefix}--item-icon`}>{typeof props.icon === 'string' ? <Icon value={props.icon} /> : props.icon}</View>}
      <View className={`${classPrefix}--item-content`}>
        <View className={`${classPrefix}--item-title`}>
          {props.title}
          {props.isNew && <Text className={`${classPrefix}--item-red-point`} />}
        </View>
        {props.note && <View className={`${classPrefix}--item-note`}>{props.note}</View>}
      </View>
      {props.extra && <View className={`${classPrefix}--item-extra`}>{props.extra}</View>}
      {props.hasArrow && <View className={`${classPrefix}--item-arrow`}>{props.arrow === 'right' && <Icon value="chevron-right" />}</View>}
    </View>,
  );
};

export default CardItem;
