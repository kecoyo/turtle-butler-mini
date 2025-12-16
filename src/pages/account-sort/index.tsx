import accountApi from '@/apis/accountApi';
import { getOpenerEventChannel, processImageUrl, rem2px, showToast } from '@/common/utils';
import { Avatar } from '@nutui/nutui-react-taro';
import { Button } from '@nutui/nutui-react-taro';
import { IconFont } from '@nutui/icons-react-taro';
import ListItem from '@/components/list-item';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount } from 'ahooks';
import classNames from 'classnames';
import _ from 'lodash';
import { useState } from 'react';
import './index.scss';
import { accountSortSelector, fetchAccountList, sortAccountList } from './reducer';

const classPrefix = 'lj-account-sort-page';

// 临时变量
let y: number, y1: number, y2: number;
// 列表元素高度
const itemHeight = rem2px(110);

/**
 * 账号列表
 */
const AccountSort = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector(accountSortSelector);
  const router = useRouter();
  const categoryId = Number(router.params.categoryId);

  // drag
  const [startIndex, setStartIndex] = useState(-1); // 原始位置
  const [toIndex, setToIndex] = useState(-1); // 目标位置
  const [dragTop, setDragTop] = useState(-1); // 拖动top

  useMount(() => {
    dispatch(fetchAccountList(categoryId));
  });

  const onMoveStart = useMemoizedFn((e, index) => {
    y = e.touches[0].clientY;
    y1 = e.currentTarget.offsetTop;
    y2 = index * itemHeight;

    // console.log(y, y1, y2);

    setStartIndex(index);
    setToIndex(index);
    setDragTop(y2);
  });

  const onMove = useMemoizedFn((e, index) => {
    y2 = e.touches[0].clientY - y + index * itemHeight;

    const moveToIndex = Math.round(y2 / itemHeight);

    // console.log(y2, moveToIndex);

    setDragTop(y2);
    setToIndex(moveToIndex);
  });

  const onMoveEnd = useMemoizedFn((e, index) => {
    // 完成排序
    dispatch(sortAccountList({ startIndex, toIndex }));

    // 重置
    setStartIndex(-1);
    setToIndex(-1);
    setDragTop(-1);
  });

  const onSave = useMemoizedFn(async () => {
    // 排序后的账号id数组
    const ids = list.map((item) => item.id);

    // 保存排序
    await accountApi.sortAccount({ ids });
    await showToast('保存成功');

    // 返回并通知列表刷新
    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk');
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <View className={`${classPrefix}--list`}>
        {list.map((item, index) => (
          <>
            {toIndex == index && startIndex >= index && <ListItem className="item-placeholder" arrow="none" />}
            <ListItem
              className={classNames({
                'item-moving': startIndex == index,
              })}
              key={item.id} //
              icon={<Avatar src={processImageUrl(item.icon)} />}
              title={item.name}
              note={_.get(item, 'properties[0].name') + '：' + _.get(item, 'properties[0].value')}
              extra={
                <View className="item-drag" onTouchStart={(e) => onMoveStart(e, index)} onTouchMove={(e) => onMove(e, index)} catchMove onTouchEnd={(e) => onMoveEnd(e, index)}>
                  <IconFont name="drag" fontClassName="iconfont" classPrefix="iconfont" size={16} />
                </View>
              }
              arrow="none"
              style={{ top: startIndex === index ? dragTop : 0 }}
            />
            {toIndex == index && startIndex < index && <ListItem className="item-placeholder" arrow="none" />}
          </>
        ))}
      </View>

      {list.length > 0 && (
        <View className={`${classPrefix}--footer`}>
          <Button type="primary" block size="large" onClick={onSave}>
            保存
          </Button>
        </View>
      )}
    </View>
  );
};

export default AccountSort;
