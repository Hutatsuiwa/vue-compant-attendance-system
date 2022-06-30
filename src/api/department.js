import request from "@/utils/request";

//获取部门信息
export function getList(query) {
  return request({
    url: "/api/department/get",
    method: "get",
    params: query,
  });
}

//添加部门
export function addDepartment(data) {
  return request({
    url: "/api/department/add",
    method: "post",
    data,
  });
}

//修改部门信息
export function updateDepartment(data) {
  return request({
    url: "/api/department/update",
    method: "put",
    data,
  });
}

//删除部门
export function deleteDepartment(id) {
  return request({
    url: "/api/department/delete",
    method: "delete",
    params: id,
  });
}
