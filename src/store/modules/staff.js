/*
 * @Author: your name
 * @Date: 2022-04-13 20:42:54
 * @LastEditTime: 2022-04-18 19:55:14
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-company-attendance-system\src\store\modules\staff.js
 */
import { getList, addStaff, updateStaff, deleteStaff } from "@/api/staff";

const actions = {
  // 获取员工信息
  getList(_, listQuery) {
    return new Promise((resolve, reject) => {
      getList(listQuery)
        .then((response) => {
          const { data } = response;
          resolve(data.staffList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //添加用户信息
  addStaff(_, staff) {
    staff.roles = [staff.role];
    const data = {
      staff,
    };
    return new Promise((resolve, reject) => {
      addStaff(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //更新用户信息
  updateStaff(_, staff) {
    staff.roles = [staff.role];
    const data = {
      staff,
    };
    return new Promise((resolve, reject) => {
      updateStaff(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //删除用户信息
  deleteStaff(_, id) {
    return new Promise((resolve, reject) => {
      deleteStaff(id)
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
  actions,
};
