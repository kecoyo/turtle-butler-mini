import { NativeProps, withNativeProps } from '@/common/native-props';
import { rem2px } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn, useMount } from 'ahooks';
import { useState } from 'react';
import AddPropertyModal from '../add-property-modal';
import Icon from '../icon';
import Input from '../input';
import './property-viewer.scss';

export interface FileItem {
  path: string;
  size: number;
}

export interface File {
  url: string;
  file?: FileItem;
}

export type PropertyViewerProps = {
  /**
   * 属性数组, 元素为对象, 包含属性 name, value（必选)
   */
  properties: AccountProperty[];
  /**
   * 是否显示添加属性按钮
   */
  showAddBtn?: boolean;
  /**
   * 添加属性
   */
  onAdd: (prop: AccountProperty) => void;
  /**
   * 删除属性
   * @param index 删除属性的位置
   * @returns
   */
  onRemove: (index: number) => void;
  /**
   * 修改属性
   * @param index 修改属性的位置
   * @param value 修改属性的值
   * @returns
   */
  onChange: (index: number, value: any) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-property-viewer';

const PropertyViewer: React.FC<PropertyViewerProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [visible, setVisible] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(-1);
  const [itemWrapInAni, setItemWrapInAni] = useState<any>(null);
  const [itemWrapInAni2, setItemWrapInAni2] = useState<any>(null);
  const [itemWrapOutAni, setItemWrapOutAni] = useState<any>(null);

  useMount(() => {
    // 创建动画
    let aniItemWrapIn = Taro.createAnimation({ timingFunction: 'ease' });
    aniItemWrapIn.translate(0, 0).step();
    setItemWrapInAni(aniItemWrapIn.export());

    let aniItemWrapOut = Taro.createAnimation({ timingFunction: 'ease' });
    let px = rem2px(150);
    aniItemWrapOut.translate(-px, 0).step();
    setItemWrapOutAni(aniItemWrapOut.export());

    let aniItemWrapIn2 = Taro.createAnimation({ duration: 0, timingFunction: 'ease' });
    aniItemWrapIn2.translate(0, 0).step();
    setItemWrapInAni2(aniItemWrapIn2.export());
  });

  // 修改属性值
  const onChange = useMemoizedFn((index: number, value: any) => {
    props.onChange(index, value);
  });

  // 添加属性，打开添加弹框
  const onAdd = useMemoizedFn(() => {
    setVisible(true);
  });

  // 取消添加属性
  const onAddCancel = useMemoizedFn(() => {
    setVisible(false);
  });

  // 确认添加属性
  const onAddOk = useMemoizedFn((prop: AccountProperty) => {
    setVisible(false);
    props.onAdd(prop);
  });

  // 开始移除，打开确认按钮
  const onRemove = useMemoizedFn((index: number) => {
    setRemoveIndex(index);
  });

  // 取消移除
  const onRemoveCancel = useMemoizedFn((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (removeIndex !== -1) setRemoveIndex(-1);
  });

  // 确认移除
  const onRemoveOk = useMemoizedFn((index) => {
    setRemoveIndex(-1);
    setItemWrapInAni(itemWrapInAni2);
    props.onRemove(index);
  });

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <View className={`${classPrefix}--property-list`}>
        {props.properties.map((item, index) => (
          <View key={index} className={`${classPrefix}--property-item`}>
            <View className="item-wrap" animation={removeIndex == index ? itemWrapOutAni : itemWrapInAni}>
              <View className="item-content" onClick={onRemoveCancel}>
                <View className="item-remove" onClick={() => onRemove(index)}>
                  <Icon value="remove" prefixClass="iconfont" size="small" />
                </View>
                <View className="item-name">
                  <Text>{item.name}</Text>
                </View>
                <View className="item-value">
                  {/* <input wx:if="{isEditing}" value="{item.value}" bindinput="bindValueInput({index})" /> */}
                  {/* <Text bindlongtap="bindItemValueLongTap({item})">{item.value}</Text> */}
                  <Input value={item.value} onChange={(val) => onChange(index, val)} />
                </View>
                <View className="item-drag" catchtouchstart="bindMoveStart({index})" catchtouchmove="bindMove({index})" catchtouchend="bindMoveEnd({index})">
                  <Icon value="sort" prefixClass="iconfont"></Icon>
                </View>
              </View>
              <View className="item-delete" onClick={() => onRemoveOk(index)}>
                删除
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className={`${classPrefix}--add-btn`} onClick={onAdd}>
        添加属性
      </View>

      {/* 添加属性弹框 */}
      <AddPropertyModal visible={visible} onCancel={onAddCancel} onOk={onAddOk} />
    </View>,
  );
};

export default PropertyViewer;