const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.userInfo.avatar,
  name: (state) => state.user.userInfo.name,
  roles: (state) => state.user.userInfo.roles,
  userInfo: (state) => state.user.userInfo,
  userAttendance: (state) => state.user.userAttendance,
  permission_routes: (state) => state.permission.routes,
};
export default getters;
