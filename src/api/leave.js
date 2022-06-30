import request from "@/utils/request";

//获取请假记录
export function getRecord(query) {
  return request({
    url: "/api/leave/record",
    method: "get",
    params: query,
  });
}

//修改请假记录
export function updateRecord(data) {
  return request({
    url: "/api/leave/update",
    method: "put",
    data,
  });
}

//删除请假记录
export function deleteRecord(id) {
  return request({
    url: "/api/leave/delete",
    method: "delete",
    params: id,
  });
}

//申请请假
export function apply(data) {
  return request({
    url: "/api/leave/apply",
    method: "post",
    data,
  });
}

//获取待审批请假信息
export function getWaiting(query) {
  return request({
    url: "/api/leave/waiting",
    method: "get",
    params: query,
  });
}

//审批请假
export function decide(data) {
  return request({
    url: "/api/leave/decide",
    method: "put",
    data,
  });
}
