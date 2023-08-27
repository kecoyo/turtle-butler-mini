import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import classNames from 'classnames';
import { AtInputNumber } from 'taro-ui';
import { AtInputNumberProps } from 'taro-ui/types/input-number';
import './input-number.scss';

export type InputNumberProps = {
  type?: 'number' | 'digit';
} & Omit<AtInputNumberProps, 'type'>;

const defaultProps = {
  type: 'number',
};

const classPrefix = 'lj-input-number';

const InputNumber: React.FC<InputNumberProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <AtInputNumber
      className={classNames(classPrefix, {
        [`${classPrefix}--${props.size}`]: props.size,
      })}
      {...props}
    />,
  );
};

export default InputNumber;
