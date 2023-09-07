import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import { AtInput } from 'taro-ui';
import { AtInputProps } from 'taro-ui/types/input';
import './input.scss';

export type InputProps = {
  name?: string; // 替换AtInput中的name
  size?: 'large' | 'normal' | 'small'; // 组件的大小
  textAlign?: 'left' | 'center' | 'right'; // 文字对齐方式
  full?: boolean; // 宽度100%
  circle?: boolean; // 圆角
  border?: boolean; // 显示边框
  value?: string;
  onChange?: (value: string) => void;
} & Omit<AtInputProps, 'name' | 'value' | 'onChange'>;

const defaultProps = {
  name: 'input',
  size: 'normal',
};

const classPrefix = 'lj-input';

const Input: React.FC<InputProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const otherProps = _.omit(props, ['className', 'style', 'onChange']);

  const onChange = useMemoizedFn((val) => {
    if (props.onChange && val !== props.value) {
      props.onChange(val);
    }
  });

  return withNativeProps(
    props,
    <AtInput
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--full`]: props.full,
        [`${classPrefix}--circle`]: props.circle,
        [`${classPrefix}--border`]: props.border,
        [`${classPrefix}--${props.textAlign}`]: props.textAlign,
      })}
      {...otherProps}
      onChange={onChange}
    />,
  );
};

export default Input;
