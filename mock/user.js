const tokens = {
  admin: {
    token: "admin-token",
  },
  leader: {
    token: "leader-token",
  },
  staff: {
    token: "staff-token",
  },
};

const userInfos = {
  "admin-token": {
    username: "123456789",
    roles: ["admin"],
    role: "admin",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "王管理",
    email: "123456789@yx.com",
    phone: "12345678910",
    department: "设计部",
    position: "程序开发",
  },
  "leader-token": {
    username: "114514",
    roles: ["leader"],
    role: "leader",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "李领导",
    email: "114514@yx.com",
    phone: "1145141919",
    department: "设计部",
    position: "产品经理",
  },
  "staff-token": {
    username: "1919810",
    roles: ["staff"],
    role: "staff",
    avatar:
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    name: "张职员",
    email: "1919810@yx.com",
    phone: "01987654321",
    department: "设计部",
    position: "平面设计",
  },
};

const userAttendances = {
  "admin-token": {
    isGoWork: false,
    isOffWork: false,
    goWorkTime: 1652403600000,
    offWorkTime: 1652436000000,
    attendanceRecord: [
      {
        date: 1648684800000,
        state: "normal",
      },
      {
        date: 1648771200000,
        state: "normal",
      },
      {
        date: 1648857600000,
        state: "normal",
      },
    ],
  },
  "leader-token": {
    isGoWork: true,
    isOffWork: false,
    goWorkTime: 1651449600000,
    offWorkTime: 1652436000000,
    attendanceRecord: [
      {
        date: 1648684800000,
        state: "normal",
      },
      {
        date: 1648771200000,
        state: "not",
      },
      {
        date: 1648857600000,
        state: "abnormal",
      },
    ],
  },
  "staff-token": {
    isGoWork: true,
    isOffWork: true,
    goWorkTime: 1652403600000,
    offWorkTime: 1652436000000,
    attendanceRecord: [
      {
        date: 1648684800000,
        state: "normal",
      },
      {
        date: 1648771200000,
        state: "normal",
      },
      {
        date: 1648857600000,
        state: "not",
      },
    ],
  },
};

module.exports = [
  // 登陆
  {
    url: "/api/user/login",
    type: "post",
    response: (config) => {
      const { username } = config.body.user;
      const token = tokens[username];

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: "请输入正确的密码.",
        };
      }

      return {
        code: 20000,
        data: token,
      };
    },
  },

  // 获取用户信息
  {
    url: "/api/user/info.*",
    type: "get",
    response: (config) => {
      const { token } = config.query;
      const data = {
        userInfo: userInfos[token],
      };

      // mock error
      if (!data.userInfo) {
        return {
          code: 50008,
          message: "登陆失败，无法获取个人信息",
        };
      }

      return {
        code: 20000,
        data: data,
      };
    },
  },

  // 登出
  {
    url: "/api/user/logout",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  // 更新用户信息
  {
    url: "/api/user/update/info",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  // 修改密码
  {
    url: "/api/user/update/password",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  // 获取考勤信息
  {
    url: "/api/user/attendance",
    type: "get",
    response: (config) => {
      const { token } = config.query;
      const data = {
        userAttendance: userAttendances[token],
      };
      return {
        code: 20000,
        data: data,
      };
    },
  },
];
