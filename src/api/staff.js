import request from "@/utils/request";

//获取员工信息
export function getList(query) {
  return request({
    url: "/api/staff/get",
    method: "get",
    params: query,
  });
}

//添加员工
export function addStaff(data) {
  return request({
    url: "/api/staff/add",
    method: "post",
    data,
  });
}

//修改员工信息
export function updateStaff(data) {
  return request({
    url: "/api/staff/update",
    method: "put",
    data,
  });
}

//删除员工
export function deleteStaff(id) {
  return request({
    url: "/api/staff/delete",
    method: "delete",
    params: id,
  });
}
