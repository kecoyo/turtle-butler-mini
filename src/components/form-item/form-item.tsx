import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import { IconFont } from '@nutui/icons-react-taro';
import './form-item.scss';

type Props = {
  thumb?: string | ReactNode;
  icon?: string | ReactNode;
  title: string; // 元素的标题
  hasBorder?: boolean; // 是否有边框
  disabled?: boolean; // 是否禁用
  children?: ReactNode;
} & NativeProps;

const defaultProps = {
  arrow: 'right',
  hasBorder: true,
};

const classPrefix = `lj-form-item`;

const FormItem: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  if (props.children) {
    let pp = props.children as ReactElement<any, JSXElementConstructor<any>>;
    // console.log('🚀 ~ file: form-item.tsx:38 ~ pp:', pp);
    // switch (pp.type?.name) {
    //   case _Select.type.name:
    //   case _AreaSelect.type.name:
    //   case _DateSelect.type.name:
    //   case _TeacherSelect.type.name:
    //     pp.props.border = false; // 不显示border
    //     pp.props.full = true;
    //     pp.props.textAlign = 'right';
    //     break;
    //   case _Input.type.name:
    //     pp.props.border = false; // 不显示border
    //     break;
    //   case _RadioGroup.type.name:
    //     pp.props.textAlign = 'right';
    //     break;
    //   default:
    //     break;
    // }
  }

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--border`]: props.hasBorder,
      })}
    >
      {props.icon && <View className={`${classPrefix}--item-icon`}>{typeof props.icon === 'string' ? <IconFont name={props.icon} fontClassName="iconfont" classPrefix="iconfont" size={16} /> : props.icon}</View>}
      <View className={`${classPrefix}--item-title`}>{props.title}</View>
      <View className={`${classPrefix}--item-content`}>{props.children}</View>
    </View>,
  );
};

export default FormItem;
