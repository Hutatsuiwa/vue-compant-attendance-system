import request from "@/utils/request";

//获取考勤记录
export function getRecord(query) {
  return request({
    url: "/api/attendance/record",
    method: "get",
    params: query,
  });
}

//修改考勤记录
export function updateRecord(data) {
  return request({
    url: "/api/attendance/update",
    method: "put",
    data,
  });
}

//删除考勤记录
export function deleteRecord(id) {
  return request({
    url: "/api/attendance/delete",
    method: "delete",
    params: id,
  });
}

//设置考勤
export function setAttendance(data) {
  return request({
    url: "/api/attendance/set",
    method: "post",
    data,
  });
}

//人脸匹配
export function faceMatch(data) {
  return request({
    url: "/api/attendance/match",
    method: "post",
    data,
  });
}
