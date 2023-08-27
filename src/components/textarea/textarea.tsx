import { withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import { AtTextarea } from 'taro-ui';
import { AtTextareaProps } from 'taro-ui/types/textarea';
import './textarea.scss';

export type TextareaProps = {
  circle?: boolean; // 显示圆角
  border?: boolean; // 显示边框
  value: string;
  onChange?: (value: string) => void;
} & Omit<AtTextareaProps, 'value' | 'onChange'>;

const defaultProps = {
  border: true,
  circle: true,
};

const classPrefix = 'lj-textarea';

const Textarea: React.FC<TextareaProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const otherProps = _.omit(props, ['className', 'style', 'onChange']);

  const onChange = useMemoizedFn((val: string) => {
    if (props.onChange && val !== props.value) {
      props.onChange(val);
    }
  });

  return withNativeProps(
    props,
    <AtTextarea
      className={classNames(classPrefix, {
        [`${classPrefix}--circle`]: props.circle,
        [`${classPrefix}--border`]: props.border,
      })}
      {...otherProps}
      onChange={onChange}
    />,
  );
};

export default Textarea;
