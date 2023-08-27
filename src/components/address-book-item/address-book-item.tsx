import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, Text, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import Avatar from '../avatar';
import Space from '../space';
import './address-book-item.scss';

type AddressBookItemProps = {
  avatar?: string;
  title?: string;
  note?: string | ReactNode;
  extra: string | ReactNode;
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
} & NativeProps;

const defaultProps = {
  arrow: 'right',
};

const classPrefix = `lj-address-book-item`;

const AddressBookItem: React.FC<AddressBookItemProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, {})} onClick={props.onClick}>
      <Space justifyContent="space-between">
        <Avatar className="item-avatar" image={props.avatar} />
        <Space direction="column" alignItems="flex-start" size="small" flex>
          <Text className="item-name">{props.title}</Text>
          {props.note && <View className="item-note">{props.note}</View>}
        </Space>
        {props.extra && <View className="item-extra">{props.extra}</View>}
      </Space>
    </View>,
  );
};

export default AddressBookItem;
