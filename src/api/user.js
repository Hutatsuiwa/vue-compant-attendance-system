/*
 * @Author: your name
 * @Date: 2022-04-04 00:47:25
 * @LastEditTime: 2022-04-18 01:41:46
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-company-attendance-system\src\api\user.js
 */
import request from "@/utils/request";

//用户登录
export function login(data) {
  return request({
    url: "/api/user/login",
    method: "post",
    data,
  });
}

//获取用户信息
export function getInfo() {
  return request({
    url: "/api/user/info",
    method: "get",
  });
}

//用户登出
export function logout() {
  return request({
    url: "/api/user/logout",
    method: "post",
  });
}

//修改密码
export function updatePassword(data) {
  return request({
    url: "/api/user/update/password",
    method: "put",
    data,
  });
}

//修改个人信息
export function updateInfo(data) {
  return request({
    url: "/api/user/update/info",
    method: "put",
    data,
  });
}

//获取用户考勤信息
export function getAttendance() {
  return request({
    url: "/api/user/attendance",
    method: "get",
  });
}
