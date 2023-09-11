import { NativeProps, withNativeProps } from '@/common/native-props';
import uploadImage from '@/common/upload-image';
import { getResUrl } from '@/common/utils';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import Icon from '../icon';
import Image from '../image';
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
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-image-viewer';

const ImageViewer: React.FC<ImageViewerProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const onAdd = useMemoizedFn(() => {
    uploadImage('account_picture', (url) => {
      if (props.onAdd) {
        props.onAdd({ url });
      }
    });
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

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <View className={`${classPrefix}--flex-box`}>
        {props.images.map((file, index) => (
          <View className={`${classPrefix}--flex-item`} key={index}>
            <View className={`${classPrefix}--item`}>
              {props.editable && (
                <View className={`${classPrefix}--remove-btn`} onClick={() => onRemove(index)}>
                  <Icon prefixClass="iconfont" value="delete" />
                </View>
              )}
              <Image className={`${classPrefix}--preview-img`} src={file.url} mode="aspectFit" onClick={() => onPreview(index)} />
            </View>
          </View>
        ))}
        {props.editable && (
          <View className={`${classPrefix}--flex-item`}>
            <View className={classNames(`${classPrefix}--item`, `${classPrefix}--choose-btn`)} onClick={onAdd}>
              <Icon prefixClass="iconfont" value="add" />
            </View>
          </View>
        )}
      </View>
    </View>,
  );
};

export default ImageViewer;
