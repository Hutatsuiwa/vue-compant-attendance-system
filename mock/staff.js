const Mock = require("mockjs");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      username: "@string(number,6)",
      name: "@cname",
      avatar: "@Image('182x256')",
      "role|1": ["staff", "leader", "admin"],
      phone: "@string(number,11)",
      email: "@email",
      "department|1": ["事业部", "产品部", "人事部"],
      "position|1": ["前端工程师", "后端工程师", "产品经理"],
    })
  );
}

module.exports = [
  {
    url: "/api/staff/get",
    type: "get",
    response: (config) => {
      const {
        name,
        role,
        department,
        page = 1,
        limit = 20,
        sort,
      } = config.query;

      let mockList = List.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        if (role && item.role !== role) return false;
        if (department && item.department !== department) return false;
        return true;
      });

      let mockList2 = mockList.map((item) => {
        item.roles = [item.role];
        return item;
      });

      if (sort === "-id") {
        mockList2 = mockList2.reverse();
      }

      const pageList = mockList2.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );

      return {
        code: 20000,
        data: {
          staffList: {
            total: mockList2.length,
            staffs: pageList,
          },
        },
      };
    },
  },

  {
    url: "/api/staff/add",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/staff/update",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/staff/delete",
    type: "delete",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },
];
