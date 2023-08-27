/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.scss';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
  }
}

/**
 * config.defineConstants
 */
declare var BASE_URL: string;
declare var OPEN_BASE_URL: string;

/**
 * API
 */
declare namespace API {
  /**
   * 接口请求数据定义
   */
  interface Data {
    [key: string]: any;
  }

  /**
   * 接口请求的Option
   */
  interface Option {
    /** 设置请求的 header，header 中不能设置 Referer。 */
    header?: TaroGeneral.IAnyObject;
    /** 超时时间，单位为毫秒 */
    timeout?: number;
    /** 返回的数据格式 */
    dataType?: 'json' | string;
    /** 响应的数据类型 */
    responseType?: 'text' | 'arraybuffer';
    /** 请求时显示Loading */
    showLoading?: boolean; // 默认： true
  }

  /**
   * 接口返回值定义
   */
  interface Result<T = any> {
    code: number; // 0:成功，非0:失败
    msg: string; // 提示消息
    data: T; // 任意类型的值
  }
}

declare module 'mine-type';
