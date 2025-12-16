import { NativeProps, withNativeProps } from '@/common/native-props';
import { chooseImageAndUpload } from '@/common/upload-image';
import { getResUrl, processImageUrl, rem2px } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { useState } from 'react';
import { IconFont } from '@nutui/icons-react-taro';
import { Image } from '@nutui/nutui-react-taro';
import './image-viewer.scss';

export type ImageViewerProps = {
  /**
   * 图片文件数组, 元素为对象, 包含属性 url（必选)
   */
  images: ImageItem[];
  /**
   * 单行的图片数量，不能为 0 或负数
   * @default 4
   */
  length?: number;
  /**
   * 是否可编辑
   */
  editable?: boolean;
  /**
   * 添加图片
   */
  onAdd?: (image: ImageItem) => void;
  /**
   * 删除图片
   * @param index 删除图片的位置
   * @returns
   */
  onRemove?: (index: number) => void;
  /**
   * 移动图片
   * @param startIndex 开始位置
   * @param toIndex 目标位置
   * @returns
   */
  onSort?: (startIndex: number, toIndex: number) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-image-viewer';

// 临时变量
let x: number, x1: number, x2: number;
let y: number, y1: number, y2: number;

const LEN = 5;
const GAP = rem2px(24);

// 列表元素高度
const windowInfo = Taro.getWindowInfo();
const itemSize = (windowInfo.windowWidth - GAP * (LEN + 1)) / LEN;

const ImageViewer: React.FC<ImageViewerProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  // drag
  const [startIndex, setStartIndex] = useState(-1); // 原始位置
  const [toIndex, setToIndex] = useState(-1); // 目标位置
  const [dragLeft, setDragLeft] = useState(-1); // 拖动left
  const [dragTop, setDragTop] = useState(-1); // 拖动top
  const [moving, setMoving] = useState(false);

  const onAdd = useMemoizedFn(async () => {
    const url = await chooseImageAndUpload('account_picture', 9);
    if (props.onAdd) {
      props.onAdd({ url });
    }
  });

  const onRemove = useMemoizedFn((val) => {
    if (props.onRemove) {
      props.onRemove(val);
    }
  });

  // 预览图片
  const onPreview = useMemoizedFn((index: number) => {
    let urls = props.images.map((item) => getResUrl(item.url));
    Taro.previewImage({
      urls: urls, // 需要预览的图片http链接列表
      current: urls[index], // 当前显示图片的http链接
    });
  });

  const onMoveStart = useMemoizedFn((e, index) => {
    if (!props.editable) return;

    setMoving(true);

    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
    x1 = e.currentTarget.offsetLeft;
    y1 = e.currentTarget.offsetTop;
    x2 = x1;
    y2 = y1;

    // console.log('movestart', { x, y, x1, y1, x2, y2 });

    setStartIndex(index);
    setToIndex(index);
    setDragLeft(x2);
    setDragTop(y2);
  });

  const onMove = useMemoizedFn((e, index) => {
    if (!moving) return;

    x2 = e.touches[0].clientX - x + x1;
    y2 = e.touches[0].clientY - y + y1;

    // console.log('move', { x2, y2 });

    let row = Math.round(y2 / (itemSize + GAP));
    let col = Math.round(x2 / (itemSize + GAP));
    let moveToIndex = row * LEN + col;

    // console.log('move', { row, col, moveToIndex });

    setDragLeft(x2);
    setDragTop(y2);
    setToIndex(moveToIndex);
  });

  const onMoveEnd = useMemoizedFn((e, index) => {
    if (!moving) return;

    if (props.onSort) {
      props.onSort(startIndex, toIndex);
    }

    setStartIndex(-1);
    setToIndex(-1);
    setDragLeft(-1);
    setDragTop(-1);
    setMoving(false);
  });

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <View className={`${classPrefix}--image-list`}>
        {props.images.map((file, index) => (
          <>
            {toIndex == index && startIndex >= index && <View className="image-item" style={{ width: itemSize, height: itemSize }} />}
            <View
              key={index}
              className={classNames(`image-item`, startIndex == index ? 'mainmove' : 'mainend')}
              // onLongPress={(e) => onMoveStart(e, index)}
              onTouchStart={(e) => onMoveStart(e, index)}
              onTouchMove={(e) => onMove(e, index)}
              catchMove
              onTouchEnd={(e) => onMoveEnd(e, index)}
              style={{ width: itemSize, height: itemSize, left: startIndex === index ? dragLeft : 0, top: startIndex === index ? dragTop : 0 }}
            >
              {props.editable && (
                <View className="remove-btn" onClick={() => onRemove(index)}>
                  <IconFont name="delete" fontClassName="iconfont" classPrefix="iconfont" size={12} color="#fff" />
                </View>
              )}
              <Image className="preview-img" src={processImageUrl(file.url)} mode="aspectFit" onClick={() => onPreview(index)} />
            </View>
            {toIndex == index && startIndex < index && <View className="image-item" style={{ width: itemSize, height: itemSize }} />}
          </>
        ))}
        {props.editable && (
          <View className="image-item" style={{ width: itemSize, height: itemSize }} onClick={onAdd}>
            <IconFont name="add" fontClassName="iconfont" classPrefix="iconfont" size={16} />
          </View>
        )}
      </View>
    </View>,
  );
};

export default ImageViewer;
