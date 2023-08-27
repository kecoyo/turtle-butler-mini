/**
 * 定义枚举
 */

/** ErrorCode */
export enum ApiCode {
  success = 0, // 成功
  needMoreData = 1, // 需要更多数据
  invalidToken = 401, // 无效令牌
}

/** 性别 */
export enum Gender {
  男 = 1,
  女 = 2,
}

/** 学校学段 */
export enum SchoolStage {
  幼儿园 = 1,
  小学 = 2,
  初中 = 4,
  职中 = 8,
  高中 = 16,
}

/**
 * 消息类型
 */
export enum MessageType {
  系统消息 = 1,
  入校审批 = 2,
  学生请假 = 3,
  风采 = 4,
  红花 = 5,
}

/** 年级 */
export enum ClassType {
  行政班 = 1,
  // 非行政班 = 2,
}

/**
 * 血型
 */
export enum BloodType {
  A型 = 1,
  B型 = 2,
  AB型 = 3,
  O型 = 4,
  RH型 = 5,
}

export enum JoinSchoolApplyStatus {
  未处理 = 0, // 等待审核
  已通过 = 1, // 已通过
  已拒绝 = 2, // 已拒绝
}

/**
 * 加入班级的角色
 */
export enum JoinClassRole {
  Student = 1,
  Teacher = 16,
}

/**
 * 学校角色
 */
export enum SchoolRole {
  Teacher = 0, // 普通教师
  ClassMaster = 1, // 班主任
  GradeMaster = 2, // 年级主任
  SchoolAdmin = 3, // 学校管理员
}

/**
 * 发送验证码类型
 */
export enum SendCodeType {
  SendQuitCode = 'sendQuitCode', // 退出学校，发送验证码
  SendUpdateCode = 'sendUpdateCode', // 修改手机号，发送验证码
}

/**
 * 设备类型
 */
export enum DeviceType {
  智慧班牌 = 1,
  出入终端 = 2,
  宿舍终端 = 3,
}
