import {
  getList,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/api/department";

const actions = {
  // 获取部门信息
  getList(_, listQuery) {
    return new Promise((resolve, reject) => {
      getList(listQuery)
        .then((response) => {
          const { data } = response;

          resolve(data.departmentList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //添加用户信息
  addDepartment(_, department) {
    const data = {
      department,
    };
    return new Promise((resolve, reject) => {
      addDepartment(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //更新用户信息
  updateDepartment(_, department) {
    const data = {
      department,
    };
    return new Promise((resolve, reject) => {
      updateDepartment(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //删除用户信息
  deleteDepartment(_, id) {
    return new Promise((resolve, reject) => {
      deleteDepartment(id)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default {
  namespaced: true,
  // state,
  // mutations,
  actions,
};
