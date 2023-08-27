import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { BaseEventOrig, ScrollView as TaroScrollView, ScrollViewProps as TaroScrollViewProps } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import _ from 'lodash';
import { ReactNode, useState } from 'react';
import LoadMore from '../load-more';
import './scroll-view.scss';

export type ScrollViewScrollEvent = BaseEventOrig<TaroScrollViewProps.onScrollDetail>;

export type ScrollViewProps = {
  scrollX?: boolean; // 横向滚动
  scrollY?: boolean; // 纵向滚动
  scrollLeft?: number; // 滚动条横向位置
  scrollTop?: number; // 滚动条纵向位置
  onScroll?: (event: ScrollViewScrollEvent) => void; // 滚动事件
  onPullDownRefresh?: () => Promise<any>; // 下拉刷新事件
  onPullUpLoad?: () => Promise<any>; // 上拉加载事件
  hasMore?: boolean; // 是否有更多
  showLoadMore?: boolean; // 显示加载更多
  children: ReactNode;
} & NativeProps;

const defaultProps = {
  scrollX: false,
  scrollY: true,
  showLoadMore: true,
};

const classPrefix = `lj-scroll-view`;

/**
 * 滚动视图
 */
const ScrollView: React.FC<ScrollViewProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const pickProps = _.pick(props, ['scrollX', 'scrollY', 'scrollLeft', 'scrollTop', 'onScroll']);

  const [refresherTriggered, setRefresherTriggered] = useState(false);
  const [loaderTriggered, setLoaderTriggered] = useState(false);

  // 下拉刷新
  const onRefresherRefresh = useMemoizedFn(async () => {
    if (props.onPullDownRefresh) {
      setRefresherTriggered(true);
      await props.onPullDownRefresh();
      setRefresherTriggered(false);
    }
  });

  // 到达底部了
  const onPullUpLoad = useMemoizedFn(async () => {
    // 没有更多了，不再加载了
    if (!props.hasMore) return;

    if (props.onPullUpLoad) {
      setLoaderTriggered(true);
      await props.onPullUpLoad();
      setLoaderTriggered(false);
    }
  });

  return withNativeProps(
    props,
    <TaroScrollView
      className={classPrefix}
      scrollWithAnimation
      {...pickProps}
      refresherEnabled={!!props.onPullDownRefresh}
      refresherTriggered={refresherTriggered}
      onRefresherRefresh={onRefresherRefresh}
      onScrollToLower={onPullUpLoad}
    >
      {props.children}
      {!!props.onPullUpLoad && props.showLoadMore && <LoadMore status={loaderTriggered ? 'loading' : props.hasMore ? 'more' : 'noMore'} />}
    </TaroScrollView>,
  );
};

export default ScrollView;
