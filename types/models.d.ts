/**
 * 用户信息
 */
interface UserInfo {
  id: number; // ID
  name: string; // 姓名
  gender: 0; // 性别
  avatar: string; // 头像
  birthday: Date | string | number; // 生日
  phone: string; // 手机号登录
  email: string; // Email
  remark: string; // 备注
  token: string; // token
}

/**
 * 学段
 */
interface Stage {
  id: number;
  name: string;
}

/**
 * 年级信息
 */
interface Grade {
  id: number;
  name: string;
  stageId?: number; // 学段ID
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
 * 学校信息
 */
interface SchoolInfo {
  id: number;
  name: string;
  province: number;
  city: number;
  county: number;
  phase: number; // 学段
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
  name: string; //  账号名称
  icon: string; //  账号图标
  properties: AccountProperty[]; // 属性
  pictures: AccountPicture[]; // 图片
  remark: string; // 备注
  isOpened?: boolean; // SwipeAction isOpened
}

/**
 * 账号属性
 */
interface AccountProperty {
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

/**
 * 班级管理信息
 */
interface ClassListItem extends ClassInfo {
  teacherNum: number; // 教师人数
  studentNum: number; // 学生人数
  parentNum: number; // 家长人数
  isMaster: boolean; // 我是否是班主任
}

/**
 * 教师信息
 */
interface TeacherInfo {
  id: number; // 教师id
  name: string; // 教师姓名
  avatar?: string; // 头像
  phone?: string; // 手机号
  isMaster?: boolean; // 是班主任
}

/**
 * 学生信息
 */
interface StudentInfo {
  id: number; // 学生id
  name: string; // 学生姓名
  avatar?: string; // 头像
  parents?: ParentInfo[]; // 家长列表
}

/**
 * 家长信息
 */
interface ParentInfo {
  id: number; // 家长id
  name: string; // 家长姓名
  phone?: string; // 手机号
  avatar?: string; // 头像
  children?: StudentInfo[]; // 孩子列表
}

/**
 * 入校审批信息
 */
interface JoinSchoolApprovalInfo {
  id: number; // 消息ID
  teacherInfo: TeacherInfo; // 入校教师
  time: string | number | Date;
  status: number; // 审批状态
}

/**
 * 管理员权限状态
 */
interface AdminAuthStatus {
  gradeAdmin: number; // 年级主任 0无权限，1有权限
  classCharge: number; // 班主任 0无权限，1有权限
}
