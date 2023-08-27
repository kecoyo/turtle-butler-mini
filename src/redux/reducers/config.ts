import configApi from '@/apis/configApi';
import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';
import _ from 'lodash';
import { AppDispatch, RootState } from '../store';

// 为 slice state 定义一个类型
interface ConfigState {
  banner: { img_url: string; path: string }[];
  login: {
    background_png: string;
    background_red_png: string;
    logo_png: string;
    logo_red_png: string;
    phone_png: string;
    wechat_png: string;
  };
  home: {
    auth_png: string;
    banpai_png: string;
    class_manage_png: string;
    daka_png: string;
    fengcai_png: string;
    homework_png: string;
    leave_png: string;
    notice_png: string;
    red_flag_png: string;
    red_flower_png: string;
    timetable_png: string;
    user_bg_png: string;
  };
  school: {
    bg_png: string;
  };
  profile: {
    address_png: string;
    birth_png: string;
    blood_png: string;
    class_png: string;
    country_png: string;
    education_png: string;
    email_png: string;
    grade_png: string;
    idcard_png: string;
    master_png: string;
    name_png: string;
    nation_png: string;
    native_png: string;
    phone_png: string;
    politics_png: string;
    sex_png: string;
    teach_png: string;
    teacher_license_png: string;
    time_png: string;
    type_png: string;
  };
  mine: {
    bg_png: string;
    company_png: string;
    idcard_png: string;
    leave_png: string;
    message_png: string;
    my_class_png: string;
    my_school_png: string;
    invisible_png: string;
    official_account_png: string;
    service_png: string;
  };
  fonts: {
    fontawesome_webfont_eot: string;
    fontawesome_webfont_svg: string;
    fontawesome_webfont_ttf: string;
    fontawesome_webfont_woff: string;
    fontawesome_webfont_woff_2: string;
    font_awesome_otf: string;
  };
  others: {
    avatar_png: string;
    clear_png: string;
    empty_png: string;
    gray_button_png: string;
    invert_parent_png: string;
    invert_teacher_png: string;
    long_press_png: string;
    official_qrcode_png: string;
    ok_button_png: string;
    phone_png: string;
    scan_png: string;
    search_png: string;
    selected_off_png: string;
    selected_on_png: string;
    switch_off_png: string;
    switch_on_png: string;
    unread_png: string;
    white_button_png: string;
  };
  message: {
    system_png: string;
    join_school_png: string;
  };
  webview: {
    user_service: string;
    user_privacy: string;
  };
  strings: {
    company_name: string;
    company_phone: string;
  };
}

// 使用该类型定义初始 state
const initialState: ConfigState = {
  banner: [
    { img_url: 'assets/banner/img1.png', path: '' },
    { img_url: 'assets/banner/img2.png', path: '' },
    { img_url: 'assets/banner/img3.png', path: '' },
  ],
  login: {
    background_png: 'assets/login/background.png',
    background_red_png: 'assets/login/background_red.png',
    logo_png: 'assets/login/logo.png',
    logo_red_png: 'assets/login/logo_red.png',
    phone_png: 'assets/login/phone.png',
    wechat_png: 'assets/login/wechat.png',
  },
  home: {
    auth_png: 'assets/home/auth.png',
    banpai_png: 'assets/home/banpai.png',
    class_manage_png: 'assets/home/class_manage.png',
    daka_png: 'assets/home/daka.png',
    fengcai_png: 'assets/home/fengcai.png',
    homework_png: 'assets/home/homework.png',
    leave_png: 'assets/home/leave.png',
    notice_png: 'assets/home/notice.png',
    red_flag_png: 'assets/home/red_flag.png',
    red_flower_png: 'assets/home/red_flower.png',
    timetable_png: 'assets/home/timetable.png',
    user_bg_png: 'assets/home/user_bg.png',
  },
  school: {
    bg_png: 'assets/school/bg.png',
  },
  profile: {
    address_png: 'assets/profile/address.png',
    birth_png: 'assets/profile/birth.png',
    blood_png: 'assets/profile/blood.png',
    class_png: 'assets/profile/class.png',
    country_png: 'assets/profile/country.png',
    education_png: 'assets/profile/education.png',
    email_png: 'assets/profile/email.png',
    grade_png: 'assets/profile/grade.png',
    idcard_png: 'assets/profile/idcard.png',
    master_png: 'assets/profile/master.png',
    name_png: 'assets/profile/name.png',
    nation_png: 'assets/profile/nation.png',
    native_png: 'assets/profile/native.png',
    phone_png: 'assets/profile/phone.png',
    politics_png: 'assets/profile/politics.png',
    sex_png: 'assets/profile/sex.png',
    teach_png: 'assets/profile/teach.png',
    teacher_license_png: 'assets/profile/teacher_license.png',
    time_png: 'assets/profile/time.png',
    type_png: 'assets/profile/type.png',
  },
  mine: {
    bg_png: 'assets/mine/bg.png',
    company_png: 'assets/mine/company.png',
    idcard_png: 'assets/mine/idcard.png',
    leave_png: 'assets/mine/leave.png',
    message_png: 'assets/mine/message.png',
    my_class_png: 'assets/mine/my_class.png',
    my_school_png: 'assets/mine/my_school.png',
    invisible_png: 'assets/mine/invisible.png',
    official_account_png: 'assets/mine/official_account.png',
    service_png: 'assets/mine/service.png',
  },
  fonts: {
    fontawesome_webfont_eot: 'assets/fonts/fontawesome-webfont.eot',
    fontawesome_webfont_svg: 'assets/fonts/fontawesome-webfont.svg',
    fontawesome_webfont_ttf: 'assets/fonts/fontawesome-webfont.ttf',
    fontawesome_webfont_woff: 'assets/fonts/fontawesome-webfont.woff',
    fontawesome_webfont_woff_2: 'assets/fonts/fontawesome-webfont.woff2',
    font_awesome_otf: 'assets/fonts/FontAwesome.otf',
  },
  others: {
    avatar_png: 'assets/others/avatar.png',
    clear_png: 'assets/others/clear.png',
    empty_png: 'assets/others/empty.png',
    gray_button_png: 'assets/others/gray_button.png',
    invert_parent_png: 'assets/others/invert_parent.png',
    invert_teacher_png: 'assets/others/invert_teacher.png',
    long_press_png: 'assets/others/long_press.png',
    official_qrcode_png: 'assets/others/official_qrcode.png',
    ok_button_png: 'assets/others/ok_button.png',
    phone_png: 'assets/others/phone.png',
    scan_png: 'assets/others/scan.png',
    search_png: 'assets/others/search.png',
    selected_off_png: 'assets/others/selected_off.png',
    selected_on_png: 'assets/others/selected_on.png',
    switch_off_png: 'assets/others/switch_off.png',
    switch_on_png: 'assets/others/switch_on.png',
    unread_png: 'assets/others/unread.png',
    white_button_png: 'assets/others/white_button.png',
  },
  message: {
    system_png: 'assets/message/system.png',
    join_school_png: 'assets/message/join_school.png',
  },
  webview: {
    user_service: 'webview/userservice.html',
    user_privacy: 'webview/userprivacy.html',
  },
  strings: {
    company_name: '北京乐教乐学科技有限公司',
    company_phone: '400-001-2898',
  },
};

export const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    // set state
    setConfigState: (state, action) => {
      const config = action.payload;
      Object.assign(state, config);

      // 保存 config 到 Storage 中
      Taro.setStorageSync('config', JSON.stringify(config));
    },
    // clear state
    clearConfigState: (state) => {
      Object.assign(state, initialState);
    },
    // 从 Storage 中取出 config
    initConfigFromStorage: (state) => {
      let value = Taro.getStorageSync('config');
      if (value) {
        value = JSON.parse(value) as ConfigState;
      } else {
        value = {};
      }
      Object.assign(state, _.defaultsDeep({}, value, initialState));
    },
  },
});

export const { setConfigState, clearConfigState, initConfigFromStorage } = configSlice.actions;
export const configSelector = (state: RootState) => state.config;

/**
 * 获取配置信息
 * @returns
 */
export const fetchConfig = () => async (dispatch: AppDispatch) => {
  let config = await configApi.getConfig({ t: Date.now(), token: '' });
  dispatch(setConfigState(config));
};

export default configSlice.reducer;
