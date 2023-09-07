import { getOpenerEventChannel, showToast } from '@/common/utils';
import Avatar from '@/components/avatar';
import Button from '@/components/button';
import FormItem from '@/components/form-item';
import IconSelectPicker from '@/components/icon-select-picker';
import Input from '@/components/input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useMemoizedFn, useMount, useUnmount } from 'ahooks';
import './index.scss';
import { categoryEditSelector, clearCategoryEditState, fetchCategoryInfo, saveCategoryAsync, setCategoryEditState } from './reducer';

const classPrefix = 'lj-category-edit-page';

/**
 * 分类编辑
 */
const CategoryEdit = () => {
  const dispatch = useAppDispatch();
  const { id, name, icon } = useAppSelector(categoryEditSelector);
  const router = useRouter();

  useMount(() => {
    const categoryId = router.params.id;
    if (categoryId) {
      dispatch(fetchCategoryInfo(Number(categoryId)));
    }
  });

  useUnmount(() => {
    dispatch(clearCategoryEditState());
  });

  const onNameChange = useMemoizedFn((val: string) => dispatch(setCategoryEditState({ name: val })));
  const onIconChange = useMemoizedFn((val: string) => dispatch(setCategoryEditState({ icon: val })));

  const onSave = useMemoizedFn(async () => {
    if (!name) {
      showToast('请输入名称');
      return;
    }
    await dispatch(saveCategoryAsync({ id, name, icon }));

    const eventChannel = getOpenerEventChannel();
    eventChannel.emit('onOk');
    Taro.navigateBack();
  });

  return (
    <View className={classPrefix}>
      <View className={`${classPrefix}--container`}>
        <FormItem title="分类名称">
          <Input placeholder="请输入" value={name} maxLength={30} onChange={onNameChange} border={false} />
        </FormItem>
        <FormItem title="分类图标">
          <IconSelectPicker onChange={onIconChange}>
            <Avatar image={icon} circle />
          </IconSelectPicker>
        </FormItem>
      </View>

      <View className={`${classPrefix}--footer`}>
        <Button type="primary" full onClick={onSave}>
          保存
        </Button>
      </View>
    </View>
  );
};

export default CategoryEdit;
