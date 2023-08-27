import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import AreaSelect from '../area-select';
import DateSelect from '../date-select';
import Icon from '../icon';
import ImageIcon from '../image-icon';
import Input from '../input';
import RadioGroup from '../radio-group';
import Select from '../select';
import TeacherSelect from '../teacher-select';
import './form-item.scss';

const _Select = <Select />;
const _AreaSelect = <AreaSelect />;
const _DateSelect = <DateSelect />;
const _TeacherSelect = <TeacherSelect />;
const _Input = <Input />;
const _RadioGroup = <RadioGroup />;

type Props = {
  thumb?: string | ReactNode;
  icon?: string | ReactNode;
  title: string; // 元素的标题
  children?: ReactNode;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-form-item`;

const FormItem: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  if (props.children) {
    let pp = props.children as ReactElement<any, JSXElementConstructor<any>>;
    // console.log('🚀 ~ file: form-item.tsx:38 ~ pp:', pp);
    switch (pp.type?.name) {
      case _Select.type.name:
      case _AreaSelect.type.name:
      case _DateSelect.type.name:
      case _TeacherSelect.type.name:
        pp.props.border = false; // 不显示border
        pp.props.full = true;
        pp.props.textAlign = 'right';
        break;
      case _Input.type.name:
        pp.props.border = false; // 不显示border
        break;
      case _RadioGroup.type.name:
        pp.props.textAlign = 'right';
        break;
      default:
        break;
    }
  }

  return withNativeProps(
    props,
    <View className={classPrefix}>
      {props.thumb && <View className={`${classPrefix}--item-thumb`}>{typeof props.thumb === 'string' ? <ImageIcon src={props.thumb} /> : props.thumb}</View>}
      {props.icon && <View className={`${classPrefix}--item-icon`}>{typeof props.icon === 'string' ? <Icon value={props.icon} /> : props.icon}</View>}
      <View className={`${classPrefix}--item-title`}>{props.title}</View>
      <View className={`${classPrefix}--item-content`}>{props.children}</View>
    </View>,
  );
};

export default FormItem;
