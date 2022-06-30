const Mock = require("mockjs");

const List = [];
const count = 10;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      "name|1": ["产品部", "开发部", "设计部"],
    })
  );
}

module.exports = [
  {
    url: "/api/department/get",
    type: "get",
    response: (config) => {
      const { name, page = 1, limit = 20, sort } = config.query;

      let mockList = List.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        return true;
      });

      if (sort === "-id") {
        mockList = mockList.reverse();
      }

      const pageList = mockList.filter(
        (item, index) => index < limit * page && index >= limit * (page - 1)
      );

      return {
        code: 20000,
        data: {
          departmentList: {
            total: mockList.length,
            departments: pageList,
          },
        },
      };
    },
  },

  {
    // 添加部门信息
    url: "/api/department/add",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    // 更新部门信息
    url: "/api/department/update",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    //删除部门信息
    url: "/api/department/delete",
    type: "delete",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },
];
