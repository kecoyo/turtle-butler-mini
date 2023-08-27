import Card from '@/components/card';
import Link from '@/components/link';
import Space from '@/components/space';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { globalSelector } from '@/redux/reducers/global';
import { View } from '@tarojs/components';
import { useMount, useUpdateEffect } from 'ahooks';
import './index.scss';
import { fetchCategoryList, indexSelector } from './reducer';

const classPrefix = 'lj-index-page';

/**
 * 首页
 */
const Index = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(globalSelector);
  const { list } = useAppSelector(indexSelector);

  // 登录成功后，加载分类列表
  useMount(() => {
    if (userInfo) {
      dispatch(fetchCategoryList());
    }
  });

  // 用户信息变化时，更新分类列表
  useUpdateEffect(() => {
    dispatch(fetchCategoryList());
  }, [userInfo]);

  return (
    <View className={classPrefix}>
      {list.map((item) => (
        <Card key={item.id}>
          <Space justifyContent="space-between">
            <View className="flex1">{item.name}</View>
            <Link>生成</Link>
          </Space>
        </Card>
      ))}
    </View>
  );
};

export default Index;
