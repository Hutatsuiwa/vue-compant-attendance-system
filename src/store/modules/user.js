import {
  login,
  logout,
  getInfo,
  updateInfo,
  updatePassword,
  getAttendance,
} from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

//用户默认状态，包含token、用户名、头像
const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {
      username: "",
      name: "",
      avatar: "",
      role: "",
      roles: [],
      phone: "",
      email: "",
      department: "",
      position: "",
    },
    userAttendance: {
      isGoWork: "",
      isOffWork: "",
      goWorkTime: "",
      offWorkTime: "",
      attendanceRecords: [],
      attendanceIPs: [],
    },
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    //重置用户状态
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.userInfo.username = username;
  },
  SET_NAME: (state, name) => {
    state.userInfo.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.userInfo.avatar = avatar;
  },
  SET_ROLES: (state, roles) => {
    state.userInfo.roles = roles;
  },
  SET_ROLE: (state, role) => {
    state.userInfo.role = role;
  },
  SET_PHONE: (state, phone) => {
    state.userInfo.phone = phone;
  },
  SET_EMAIL: (state, email) => {
    state.userInfo.email = email;
  },
  SET_DEPARTMENT: (state, department) => {
    state.userInfo.department = department;
  },
  SET_POSITION: (state, position) => {
    state.userInfo.position = position;
  },
  SET_ISGOWORK: (state, isGoWork) => {
    state.userAttendance.isGoWork = isGoWork;
  },
  SET_ISOFFWORK: (state, isOffWork) => {
    state.userAttendance.isOffWork = isOffWork;
  },
  SET_GOWORKTIME: (state, goWorkTime) => {
    state.userAttendance.goWorkTime = goWorkTime;
  },
  SET_OFFWORKTIME: (state, offWorkTime) => {
    state.userAttendance.offWorkTime = offWorkTime;
  },
  SET_ATTENDANCERECORDS: (state, attendanceRecords) => {
    state.userAttendance.attendanceRecords = attendanceRecords;
  },
  SET_ATTENDANCEIPS: (state, attendanceIPs) => {
    state.userAttendance.attendanceIPs = attendanceIPs;
  },
};

const actions = {
  // 用户登陆
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const loginData = {
      user: {
        username: username.trim(),
        password: password,
      },
    };
    return new Promise((resolve, reject) => {
      login(loginData)
        .then((response) => {
          //这里调用的是api中的login function
          const { data } = response;
          commit("SET_TOKEN", data.token); //获取返回的token，并更新到用户状态上
          setToken(data.token); //将token保存在cookie中
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //获取用户信息，例如姓名、头像等
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            return reject("认证失败，请重新登陆.");
          }

          const {
            roles,
            name,
            avatar,
            username,
            role,
            email,
            phone,
            department,
            position,
          } = data.userInfo;
          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject("该用户不存在权限!");
          }

          commit("SET_ROLES", roles);
          commit("SET_USERNAME", username);
          commit("SET_NAME", name);
          commit("SET_AVATAR", avatar);
          commit("SET_ROLE", role);
          commit("SET_PHONE", phone);
          commit("SET_EMAIL", email);
          commit("SET_DEPARTMENT", department);
          commit("SET_POSITION", position);

          resolve(data.userInfo); //用户可以继续操作后端传来的数据
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //用户登出
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken(); // must remove  token  first//必须首先清除cookie中保存的token
          resetRouter(); //重置路由器
          commit("RESET_STATE"); //重置用户状态
          commit("SET_ROLES", []);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //移除token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      commit("SET_ROLES", []);
      resolve();
    });
  },

  //修改密码
  updatePassword(_, user) {
    return new Promise((resolve, reject) => {
      const data = {
        user,
      };
      updatePassword(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //更新用户信息
  updateInfo({ commit }, userInfo) {
    const data = {
      userInfo,
    };
    return new Promise((resolve, reject) => {
      updateInfo(data)
        .then(() => {
          const { email, phone } = userInfo;
          commit("SET_PHONE", phone);
          commit("SET_EMAIL", email);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  //获取用户考勤信息
  getAttendance({ commit, state }) {
    return new Promise((resolve, reject) => {
      getAttendance(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            return reject("获取失败.");
          }

          const {
            isGoWork,
            isOffWork,
            attendanceRecords,
            goWorkTime,
            offWorkTime,
            attendanceIPs,
          } = data.userAttendance;

          commit("SET_ISGOWORK", isGoWork);
          commit("SET_ISOFFWORK", isOffWork);
          commit("SET_GOWORKTIME", goWorkTime);
          commit("SET_OFFWORKTIME", offWorkTime);
          commit("SET_ATTENDANCERECORDS", attendanceRecords);
          commit("SET_ATTENDANCEIPS", attendanceIPs);
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
  state,
  mutations,
  actions,
};
