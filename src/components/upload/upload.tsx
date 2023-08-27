import { NativeProps, withNativeProps } from '@/common/native-props';
import uploadImage from '@/common/upload-image';
import mergeProps from '@/common/with-default-props';
import { View } from '@tarojs/components';
import { useMemoizedFn } from 'ahooks';
import { ReactNode, useState } from 'react';
import './upload.scss';

type Props = {
  tags: string;
  children: ReactNode;
  onChange?: (url: string) => void;
} & NativeProps;

const defaultProps = {};

const classPrefix = `lj-upload`;

const Upload: React.FC<Props> = (p) => {
  const props = mergeProps(defaultProps, p);
  const [src, setSrc] = useState('');

  // useMount(() => {
  //   updateImage(props.image);
  // });

  // useUpdateEffect(() => {
  //   updateImage(props.image);
  // }, [props.image]);

  // const updateImage = (image: string | undefined) => {
  //   if (image) {
  //     if (image.startsWith('dmres/')) {
  //       setSrc(DMRES_URL + image);
  //     } else {
  //       setSrc(image);
  //     }
  //   } else {
  //     setSrc('image');
  //   }
  // };

  const onUpload = useMemoizedFn(async () => {
    await uploadImage(props.tags, onChange);
  });

  const onChange = useMemoizedFn(async (url: string) => {
    if (url && props.onChange) {
      props.onChange(url);
    }
  });

  return withNativeProps(
    props,
    <View className={classPrefix} onClick={onUpload}>
      {props.children}
    </View>,
  );
};

export default Upload;
