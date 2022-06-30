const Mock = require("mockjs");
const Moment = require("moment");

const List = [];
const count = 100;

for (let i = 0; i < count; i++) {
  List.push(
    Mock.mock({
      id: "@increment",
      date: "@date('T')",
      staffName: "@cname",
      leaderName: "@cname",
      detail: "@paragraph",
      "leaveType|1": ["affair", "illness", "marry", "dead", "birth"],
      "leaveState|1": ["wait", "agree", "reject"],
    })
  );
}

module.exports = [
  {
    url: "/api/leave/record",
    type: "get",
    response: (config) => {
      const {
        staffName,
        date,
        leaderName,
        leaveType,
        leaveState,
        page = 1,
        limit = 20,
        sort,
      } = config.query;

      let mockList = List.filter((item) => {
        if (staffName && item.staffName.indexOf(staffName) < 0) return false;
        if (leaderName && item.leaderName.indexOf(leaderName) < 0) return false;
        if (
          date &&
          Moment(+date).format("YYYY MM DD") !==
            Moment(+item.date).format("YYYY MM DD")
        )
          return false;
        if (leaveType && item.leaveType !== leaveType) return false;
        if (leaveState && item.leaveState !== leaveState) return false;
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
          leaveRecord: {
            total: mockList.length,
            records: pageList,
          },
        },
      };
    },
  },

  {
    url: "/api/leave/update",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/leave/delete",
    type: "delete",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/leave/apply",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },

  {
    url: "/api/leave/waiting",
    type: "get",
    response: (config) => {
      const {
        staffName,
        date,
        leaveType,
        leaveState,
        page = 1,
        limit = 20,
        sort,
      } = config.query;

      let mockList = List.filter((item) => {
        if (staffName && item.staffName.indexOf(staffName) < 0) return false;
        if (
          date &&
          Moment(+date).format("YYYY MM DD") !==
            Moment(+item.date).format("YYYY MM DD")
        )
          return false;
        if (leaveType && item.leaveType !== leaveType) return false;
        if (leaveState && item.leaveState !== leaveState) return false;
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
          waitingList: {
            total: mockList.length,
            lists: pageList,
          },
        },
      };
    },
  },

  {
    url: "/api/leave/decide",
    type: "put",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },
];
