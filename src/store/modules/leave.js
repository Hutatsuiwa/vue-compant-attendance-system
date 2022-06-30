import {
  getRecord,
  updateRecord,
  deleteRecord,
  getWaiting,
  apply,
  decide,
} from "@/api/leave";

const actions = {
  // 获取请假信息
  getRecord(_, listQuery) {
    return new Promise((resolve, reject) => {
      getRecord(listQuery)
        .then((response) => {
          const { data } = response;

          resolve(data.leaveRecord);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //更新请假信息
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

  //删除请假信息
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

  //申请请假
  apply(_, record) {
    const data = {
      record,
    };
    return new Promise((resolve, reject) => {
      apply(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取待审批信息
  getWaiting(_, listQuery) {
    return new Promise((resolve, reject) => {
      getWaiting(listQuery)
        .then((response) => {
          const { data } = response;

          resolve(data.waitingList);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 审批请假
  decide(_, list) {
    const data = {
      list,
    };
    return new Promise((resolve, reject) => {
      decide(data)
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
