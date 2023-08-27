import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Radio, RadioGroup as TaroRadioGroup } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { SelectOption } from '../select';
import Space from '../space';
import './radio-group.scss';

type Props = {
  // size?: 'large' | 'normal' | 'small'; // 组件的大小
  textAlign?: 'left' | 'center' | 'right'; // 文字对齐方式

  options?: SelectOption[];
  value?: number;
  onChange?: (value: number) => void;
} & NativeProps;

const defaultProps = {
  options: [],
  // size: 'normal',
  textAlign: 'left',
};

const classPrefix = `lj-radio-group`;

const RadioGroup: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onSelectChange = useMemoizedFn((e) => {
    if (props.onChange) {
      props.onChange(Number(e.detail.value));
    }
  });

  return withNativeProps(
    props,
    <TaroRadioGroup
      className={classNames(classPrefix, {
        // [`${classPrefix}--${props.size}`]: props.size,
        [`${classPrefix}--${props.textAlign}`]: props.textAlign,
      })}
      onChange={onSelectChange}
    >
      <Space size={props.size}>
        {props.options.map((opt, i) => (
          <Radio key={i} value={String(opt.value)} checked={props.value === opt.value}>
            {opt.label}
          </Radio>
        ))}
      </Space>
    </TaroRadioGroup>,
  );
};

export default RadioGroup;
