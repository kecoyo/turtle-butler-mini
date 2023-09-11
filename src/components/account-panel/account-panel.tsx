import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { CommonEventFunction, View } from '@tarojs/components';
import classNames from 'classnames';
import { ReactNode } from 'react';
import './account-panel.scss';

export type AccountPanelProps = {
  title?: string; // 元素的标题
  extra?: string | ReactNode; // 额外信息的文本
  onClick?: CommonEventFunction; // 用户点击元素触发的事件
  children?: string | ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-account-panel`;

const AccountPanel: React.FC<AccountPanelProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classNames(classPrefix, {})} onClick={props.onClick}>
      {props.title && (
        <View className={`${classPrefix}--header`}>
          <View className={`${classPrefix}--item-title`}>{props.title}</View>
          {props.extra && <View className={`${classPrefix}--item-extra`}>{props.extra}</View>}
        </View>
      )}
      <View className={`${classPrefix}--content`}>{props.children}</View>
    </View>,
  );
};

export default AccountPanel;
