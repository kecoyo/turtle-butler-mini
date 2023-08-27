import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Text, View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import './load-more.scss';

type Props = {
  status: 'loading' | 'more' | 'noMore';
} & NativeProps;

const defaultProps = {
  state: 'more',
};

const classPrefix = `lj-load-more`;

const LoadMore: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);

  return withNativeProps(
    props,
    <View className={classPrefix}>
      {props.status === 'loading' && <AtActivityIndicator content="加载中..."></AtActivityIndicator>}
      {props.status === 'more' && <Text>上拉加载更多</Text>}
      {props.status === 'noMore' && <Text>已经到底了</Text>}
    </View>,
  );
};

export default LoadMore;
