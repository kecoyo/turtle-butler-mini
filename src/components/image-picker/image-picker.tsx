import { NativeProps, withNativeProps } from '@/common/native-props';
import uploadImage from '@/common/upload-image';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import Icon from '../icon';
import Image from '../image';
import './image-picker.scss';

export interface FileItem {
  path: string;
  size: number;
}

export interface File {
  url: string;
  file?: FileItem;
}

export type ImagePickerProps = {
  /**
   * 图片文件数组, 元素为对象, 包含属性 url（必选)
   */
  files: File[];
  /**
   * 是否显示添加图片按钮
   */
  showAddBtn?: boolean;
  /**
   * 单行的图片数量，不能为 0 或负数
   * @default 4
   */
  length?: number;
  /**
   * 添加图片
   */
  onAdd: (file: File) => void;
  /**
   * 删除图片
   * @param index 删除图片的位置
   * @returns
   */
  onRemove: (index: number) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = 'lj-image-picker';

const ImagePicker: React.FC<ImagePickerProps> = (p) => {
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

  return withNativeProps(
    props,
    <View className={classPrefix}>
      <View className={`${classPrefix}--flex-box`}>
        {props.files.map((file, index) => (
          <View className={`${classPrefix}--flex-item`} key={index}>
            <View className={`${classPrefix}--item`}>
              <View className={`${classPrefix}--remove-btn`} onClick={() => onRemove(index)}>
                <Icon prefixClass="iconfont" value="delete" />
              </View>
              <Image className={`${classPrefix}--preview-img`} src={file.url} mode="aspectFit" />
            </View>
          </View>
        ))}
        <View className={`${classPrefix}--flex-item`}>
          <View className={classNames(`${classPrefix}--item`, `${classPrefix}--choose-btn`)} onClick={onAdd}>
            <Icon prefixClass="iconfont" value="add" />
          </View>
        </View>
      </View>
    </View>,
  );
};

export default ImagePicker;
