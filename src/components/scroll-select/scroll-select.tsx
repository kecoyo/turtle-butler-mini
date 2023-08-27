import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Text, View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import ScrollView from '../scroll-view';
import './scroll-select.scss';

export interface SelectOption {
  value: number;
  label: string;
}

type ScrollSelectProps = {
  options?: SelectOption[];
  value?: number;
  onChange?: (value: number) => void;
} & NativeProps;

const defaultProps = {
  options: [],
};

const classPrefix = `lj-scroll-select`;

const ScrollSelect: React.FC<ScrollSelectProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onChange = useMemoizedFn((value) => {
    if (props.onChange) {
      props.onChange(value);
    }
  });

  return withNativeProps(
    props,
    <ScrollView className={classNames(classPrefix, {})} scrollX scrollY={false}>
      <View className="option-list">
        {props.options.map((opt, i) => (
          <Text key={i} className={classNames('option-item', { active: opt.value === props.value })} onClick={() => onChange(opt.value)}>
            {opt.label}
          </Text>
        ))}
        <Text className="option-item">&nbsp;</Text>
      </View>
      {/* <View className="more-arrow">&gt;&gt;</View> */}
    </ScrollView>,
  );
};

export default ScrollSelect;
