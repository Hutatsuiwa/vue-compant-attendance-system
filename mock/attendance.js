const Mock = require("mockjs");
const Moment = require("moment");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      date: "@date('T')",
      name: "@cname",
      "goWorkState|1": ["wait", "normal", "late", "leave", "not"],
      goWorkTime: "@Time('T')",
      "offWorkState|1": ["wait", "normal", "early", "leave", "not"],
      offWorkTime: "@Time('T')",
      phone: "@string(number,11)",
    })
  );
}

module.exports = [
  {
    url: "/api/attendance/record",
    type: "get",
    response: (config) => {
      const {
        name,
        date,
        goWorkState,
        offWorkState,
        page = 1,
        limit = 20,
        sort,
      } = config.query;

      let mockList = List.filter((item) => {
        if (name && item.name.indexOf(name) < 0) return false;
        if (
          date &&
          Moment(+date).format("YYYY MM DD") !==
            Moment(+item.date).format("YYYY MM DD")
        )
          return false;
        if (goWorkState && item.goWorkState !== goWorkState) return false;
        if (offWorkState && item.offWorkState !== offWorkState) return false;
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
          attendanceRecords: {
            total: mockList.length,
            records: pageList,
          },
        },
      };
    },
  },

  {
    url: "/api/attendance/update",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/attendance/delete",
    type: "delete",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/attendance/set",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/attendance/match",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },
];
