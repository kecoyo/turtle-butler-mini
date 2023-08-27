import { NativeProps, withNativeProps } from '@/common/native-props';
import { getConfigUrl } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { useAppSelector } from '@/redux/hooks';
import { configSelector } from '@/redux/reducers/config';
import { Image, Text, View } from '@tarojs/components';
import './empty.scss';

type Props = {
  title?: string;
} & NativeProps;

const defaultProps = {
  title: '空空如也',
};

const classPrefix = 'lj-empty';

const Empty: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);
  const config = useAppSelector(configSelector);

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <Image src={getConfigUrl(config.others.empty_png)} />
      <Text>{props.title}</Text>
    </View>,
  );
};

export default Empty;
