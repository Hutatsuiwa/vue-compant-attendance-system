import Cookies from "js-cookie";

//将sidebar的状态存储在cookie里
const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true, //检查cookie里有没有保存过的状态，有则转换为boolen值，否则默认设置为true
    withoutAnimation: false,
  },
  device: "desktop",
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    //改变sideBar的展开/收起状态
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    //改变当前设备类型
    commit("TOGGLE_DEVICE", device);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
