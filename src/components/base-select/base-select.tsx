import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import classNames from 'classnames';
import Icon from '../icon';
import './base-select.scss';

export type BaseSelectProps = {
  placeholder?: string; // 缺失占位符
  size?: 'large' | 'normal' | 'small'; // 组件的大小
  textAlign?: 'left' | 'center' | 'right'; // 文字对齐方式
  // full?: boolean; // 宽度100%
  border?: boolean; // 显示边框
  value?: string; // 显示文本
  onSelect?: () => void; // 触发点击选择事件
} & NativeProps;

const defaultProps = {
  border: true,
  textAlign: 'left',
};

const classPrefix = 'lj-base-select';

const BaseSelect: React.FC<BaseSelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
        // [`${classPrefix}--full`]: props.full,
        [`${classPrefix}--border`]: props.border,
        [`${classPrefix}--${props.textAlign}`]: props.textAlign,
      })}
      onClick={props.onSelect}
    >
      {props.value ? ( //
        <View className={`${classPrefix}--value`}>{props.value}</View>
      ) : (
        <View className={`${classPrefix}--value placeholder`}>{props.placeholder}</View>
      )}
      <Icon className={`${classPrefix}--icon`} value="chevron-down" />
    </View>,
  );
};

export default BaseSelect;
