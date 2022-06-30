/*
 * @Author: your name
 * @Date: 2022-04-14 20:29:37
 * @LastEditTime: 2022-04-19 16:31:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-company-attendance-system\src\store\modules\attendance.js
 */
import {
  getRecord,
  updateRecord,
  deleteRecord,
  setAttendance,
  faceMatch,
} from "@/api/attendance";

const actions = {
  // 获取考勤信息
  getRecord(_, listQuery) {
    return new Promise((resolve, reject) => {
      getRecord(listQuery)
        .then((response) => {
          const { data } = response;

          resolve(data.attendanceRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //更新考勤信息
  updateRecord(_, record) {
    const data = {
      record,
    };
    return new Promise((resolve, reject) => {
      updateRecord(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //删除考勤信息
  deleteRecord(_, id) {
    return new Promise((resolve, reject) => {
      deleteRecord(id)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //设置考勤
  setAttendance(_, option) {
    const data = {
      option,
    };
    return new Promise((resolve, reject) => {
      setAttendance(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 人脸识别
  faceMatch(_, user) {
    const data = {
      user,
    };
    return new Promise((resolve, reject) => {
      faceMatch(data)
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
