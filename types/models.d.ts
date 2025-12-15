/**
 * 用户信息
 */
interface UserInfo {
  id: number; // ID
  nickname?: string; // 昵称
  name?: string; // 姓名
  gender?: number; // 性别
  avatar?: string; // 头像
  birthday?: Date | string | number; // 生日
  phone?: string; // 手机号登录
  email?: string; // Email
  remark?: string; // 备注
  province?: number; // 省
  city?: number; // 市
  county?: number; // 区县
  idCard?: string; // 身份证
  token?: string; // token
}

/**
 * 区域信息
 */
interface Area {
  id: number;
  name: string;
  level: number;
  pid: number;
}

/**
 * 账号分类信息
 */
interface CategoryInfo {
  id: number; // ID
  name: string; // 分类名称
  icon: string; // 分类图标
  count?: number; // 该分类下的账号数量
  isOpened?: boolean; // SwipeAction isOpened
}

/**
 * 账号信息
 */
interface AccountInfo {
  id: number; //账号ID
  categoryId: number; // 账号分类ID
  name: string; //  账号名称
  icon: string; //  账号图标
  properties: PropertyItem[]; // 属性
  pictures: ImageItem[]; // 图片
  remark: string; // 备注
  isOpened?: boolean; // SwipeAction isOpened
}

/**
 * 账号属性
 */
interface PropertyItem {
  name: string;
  value: string;
}

/**
 * 账号图片
 */
interface AccountPicture {
  url: string;
}

/**
 * 图标信息
 */
interface IconInfo {
  id: number; // 图标分类ID
  name: string; // 图标分类名称
  icons: string[]; // 图标url列表
}

interface ImageFile {
  path: string;
  size: number;
}

interface ImageItem {
  url: string;
  file?: ImageFile;
}
