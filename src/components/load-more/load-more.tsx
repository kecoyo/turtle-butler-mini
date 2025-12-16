import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { Text, View } from '@tarojs/components';
import { Loading } from '@nutui/nutui-react-taro';
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
      {props.status === 'loading' && (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loading type="spinner" />
          <Text style={{ marginLeft: '8px' }}>加载中...</Text>
        </View>
      )}
      {props.status === 'more' && <Text>上拉加载更多</Text>}
      {props.status === 'noMore' && <Text>已经到底了</Text>}
    </View>,
  );
};

export default LoadMore;
