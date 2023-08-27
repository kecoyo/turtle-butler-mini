import { NativeProps, withNativeProps } from '@/common/native-props';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn, useMount, useUpdateEffect } from 'ahooks';
import React, { ReactNode, useState } from 'react';
import Empty from '../empty';
import ScrollView, { ScrollViewProps } from '../scroll-view';
import './list-view.scss';

export type ListViewProps = {
  initialLoad?: boolean; // 是否初始加载
  loading?: boolean; // 自己控制loading
  list: any[]; // 列表数据
  renderItem: (item: any, index?: number) => ReactNode; // 渲染行
  page?: number; // 分页时，当前页
  onLoad?: (page: number) => Promise<any>; // 加载数据方法，page：页码
  renderHeader?: () => ReactNode; // 在列表头部添加内容
  renderFooter?: () => ReactNode; // 在列表尾部添加内容
  pullDownRefresh?: boolean; // 开启下拉刷新
  pullUpLoad?: boolean; // 开启上拉加载
} & Omit<ScrollViewProps, 'children' | 'onPullDownRefresh' | 'onPullUpLoad' | 'showLoadMore'> &
  NativeProps;

export const defaultProps = {
  initialLoad: false,
  loading: false,
  page: 1,
  pullDownRefresh: false,
  pullUpLoad: false,
};

const classPrefix = `lj-list-view`;

const ListView: React.FC<ListViewProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [loading, setLoading] = useState(typeof props.loading !== 'undefined' ? props.loading : true);

  useMount(() => {
    if (props.initialLoad) {
      onPullDownRefresh();
    } else if (typeof props.loading !== 'undefined') {
      setLoading(props.loading);
    } else {
      setLoading(false);
    }
  });

  useUpdateEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  const onPullDownRefresh = useMemoizedFn(async () => {
    if (props.onLoad) {
      await props.onLoad(1);
      setLoading(false);
    }
  });

  const onPullUpLoad = useMemoizedFn(async () => {
    if (props.onLoad) {
      await props.onLoad(props.page + 1);
    }
  });

  return withNativeProps(
    props,
    <ScrollView
      className={`${classPrefix}`}
      onPullDownRefresh={props.pullDownRefresh ? onPullDownRefresh : undefined}
      onPullUpLoad={props.pullUpLoad && props.list.length > 0 ? onPullUpLoad : undefined}
      hasMore={props.hasMore}
      showLoadMore={props.page > 1}
    >
      {props.renderHeader && <View className={`${classPrefix}-header`}>{props.renderHeader()}</View>}
      {!loading && props.list.length === 0 && (
        <View className={`${classPrefix}-empty`}>
          <Empty />
        </View>
      )}
      <View className={`${classPrefix}-list`}>{props.list.map(props.renderItem)}</View>
      {props.renderFooter && <View className={`${classPrefix}-footer`}>{props.renderFooter()}</View>}
    </ScrollView>,
  );
};

export default ListView;
