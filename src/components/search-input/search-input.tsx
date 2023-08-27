import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Input, Text, View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import Icon from '../icon';
import './search-input.scss';

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
} & NativeProps;

const defaultProps = {
  onChange: (e: any) => e,
};

const classPrefix = `lj-search-input`;

const SearchInput: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onSearch = useMemoizedFn(() => {
    if (props.onSearch) {
      props.onSearch(props.value || '');
    }
  });

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <Input className={`${classPrefix}--input`} placeholder={props.placeholder} value={props.value} onInput={(e) => props.onChange(e.detail.value)} />
      <Text className={`${classPrefix}--split`} />
      <Icon className={`${classPrefix}--icon`} type="primary" value="search" onClick={onSearch} />
    </View>,
  );
};

export default SearchInput;
