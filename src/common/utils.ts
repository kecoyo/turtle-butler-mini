import { SelectOption } from '@/components/select';
import Taro, { getCurrentPages } from '@tarojs/taro';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import _ from 'lodash';
import { APP_RES_URL, RES_URL } from './constants';
import { SchoolStage } from './enums';

dayjs.extend(duration);

/**
 * 休息一会儿
 * @param time 时间（ms）
 * @returns
 */
export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * 格式化日期
 * @param date 日期
 * @returns
 */
export const formatDate = (date: Date | string | number, template?: string) => {
  return dayjs(date).format(template || 'YYYY-MM-DD');
};

/**
 * 格式化日期时间
 * @param date 日期
 * @returns
 */
export const formatDateTime = (date: Date | string | number, template?: string) => {
  return dayjs(date).format(template || 'YYYY-MM-DD HH:mm:ss');
};
export const formatDuration = (date1: Date | string | number, date2?: Date | string | number) => {
  let time1 = dayjs(date1).valueOf();
  let time2 = dayjs(date2).valueOf();

  if (time2 - time1 < 1000 * 60 * 1) {
    return '刚刚';
  } else if (time2 - time1 < 1000 * 60 * 60) {
    return _.round(dayjs.duration(time2 - time1).asMinutes(), 0) + '分钟前';
  } else if (time2 - time1 < 1000 * 60 * 60 * 24) {
    return _.round(dayjs.duration(time2 - time1).asHours(), 0) + '小时前';
  } else if (time2 - time1 < 1000 * 60 * 60 * 24 * 2) {
    return '昨天';
  } else if (time2 - time1 < 1000 * 60 * 60 * 24 * 4) {
    return _.round(dayjs.duration(time2 - time1).asDays(), 0) + '天前';
  } else {
    return dayjs(date1).format('YYYY-MM-DD');
  }
};

// 显示Loading
export const showLoading = (title?: string) => {
  return Taro.showLoading({
    title: title || '加载中...',
  });
};

// 隐藏Loading
export const hideLoading = () => {
  Taro.hideLoading({});
};

// 显示提示信息
export const showToast = (title: string) => {
  return Taro.showToast({
    icon: 'none',
    title: title,
  });
};

// 检查接口返回值，并抛出Error
export const throwError = (res: API.Result) => {
  if (res.code) throw new Error(res.msg);
};

// 显示错误消息
export const showErrorMsg = (err: any) => {
  return Taro.showToast({
    icon: 'none',
    title: err.message,
  });
};

export interface showModal_Options {
  title?: string;
  content: string;
  confirmText?: string;
  confirmColor?: string;
  onOk?: () => void;
}

// 显示模态弹窗
export const showModal = (options: showModal_Options) => {
  return Taro.showModal({
    title: options.title || '提示',
    content: options.content || '这是一个模态弹窗',
    showCancel: false,
    ..._.pick(options, ['confirmText', 'confirmColor']),
    success: (result) => {
      if (result.confirm && options.onOk) {
        options.onOk();
      }
    },
  });
};

export interface showConfirm_Options {
  title?: string;
  content: string;
  confirmText?: string;
  confirmColor?: string;
  cancelText?: string;
  cancelColor?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

// 显示确认弹窗
export const showConfirm = (options: showConfirm_Options) => {
  return Taro.showModal({
    title: options.title || '提示',
    content: options.content || '这是一个确认弹窗',
    ..._.pick(options, ['confirmText', 'confirmColor', 'cancelText', 'cancelColor']),
    success: (result) => {
      if (result.confirm && options.onOk) {
        options.onOk();
      } else if (result.cancel && options.onCancel) {
        options.onCancel();
      }
    },
  });
};

/**
 * 获取用户头像
 */
export const getAvatarUrl = (avatar?: string) => {
  return avatar ? RES_URL + avatar : RES_URL + 'dmres/0/1bf71283e977d509e0d35fca4fcd3284.jpeg';
};

/**
 * 将枚举中的项转换成Select组件的Options.
 * @param enumObj 任意枚举对象
 * @param isAll 是否添加全部选项
 * @returns
 */
export const getEnumOptions = (enumObj: any, isAll?: boolean) => {
  let options: SelectOption[] = [];

  // 添加全部选项
  if (isAll) {
    options.push({ value: 0, label: '全部' });
  }

  for (const key in enumObj) {
    if (Object.prototype.hasOwnProperty.call(enumObj, key)) {
      const value = enumObj[key];
      if (typeof value === 'number') {
        options.push({ value: value, label: key });
      }
    }
  }
  return options;
};

/**
 * 转换成Select组件的Options.
 * @param list 任意包含id、name属性的列表
 * @param isAll 是否添加全部选项
 * @returns
 */
export const getSelectOptions = (list: any, isAll?: boolean) => {
  let options: SelectOption[] = [];

  // 添加全部选项
  if (isAll) {
    options.push({ value: 0, label: '全部' });
  }

  for (const item of list) {
    options.push({ value: item.id, label: item.name });
  }
  return options;
};

// // 跳转到应用内的某个页面
// export const navigateTo = (pageKey: string) => {
//   Taro.navigateTo({
//     url: `/pages/${pageKey}/index`,
//   });
// };

// 循环迭代器
export const createLoopNext = (items: any[]) => {
  let i = 0;
  return () => {
    if (i >= items.length) i = 0;
    return items[i++];
  };
};

// 根据年级id推算出学段id
export const getStageIdByGradeId = (gradeId: number) => {
  if (gradeId <= 10) {
    return SchoolStage.小学;
  } else if (gradeId <= 20) {
    return SchoolStage.初中;
  } else if (gradeId <= 30) {
    return SchoolStage.职中;
  } else if (gradeId <= 40) {
    return SchoolStage.高中;
  } else {
    return SchoolStage.幼儿园;
  }
};

// 获取资源路径
export const getResUrl = (url: string): string => {
  return RES_URL + url;
};

// 获取config中的资源路径
export const getConfigUrl = (url: string): string => {
  return APP_RES_URL + url;
};

// 有号码，直接打电话
export async function makePhoneCall(phone: string): Promise<void>;
// 无号码，先获取用户手机号码，再打电话
export async function makePhoneCall(userId: number): Promise<void>;
// 实现重载方法
export async function makePhoneCall(arg0: number | string): Promise<void> {
  let userId = typeof arg0 === 'number' ? arg0 : 0;
  let phone = typeof arg0 === 'string' ? arg0 : '';

  if (userId) {
    const res = await phoneApi.getUserPhone({ userId });
    if (res && res.phone) {
      phone = res.phone;
    }
  }

  if (phone) {
    Taro.makePhoneCall({ phoneNumber: phone });
  } else {
    showToast('没有电话号码');
  }
}

/**
 * a
 */
export function getFuncName(func: Function) {
  if (func) {
    let matchs = func.toString().match(/function\s*([^(]*)\(/);
    if (matchs) {
      return matchs[1];
    }
  }
  return null;
}

/**
 * getOpenerEventChannel
 */
export function getOpenerEventChannel() {
  const pages = getCurrentPages();
  const current = pages[pages.length - 1];
  const eventChannel = current.getOpenerEventChannel();
  return eventChannel;
}

export function px2rem(px: number) {
  return (750 / Taro.getSystemInfoSync().screenWidth) * px;
}

export function rem2px(rem: number) {
  return (Taro.getSystemInfoSync().screenWidth / 750) * rem;
}
