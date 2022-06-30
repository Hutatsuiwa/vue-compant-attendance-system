<template>
  <el-card class="mycalendar">
    <div slot="header" class="clearfix">
      <span>考勤日历</span>
    </div>
    <el-calendar>
      <template slot="dateCell" slot-scope="{ data }">
        <div class="canlendar-cell" :class="attendanceState(data)">
          <div>{{ attendanceState(data) | statewordsFilter }}</div>
          <div>{{ data.day.split("-")[2] }}</div>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script>
import Moment from "moment";
import { mapGetters } from "vuex";
export default {
  name: "MyCanlendar",
  filters: {
    statewordsFilter(state) {
      const stateTagsMap = {
        wait: "待考勤",
        normal: "正常",
        abnormal: "异常",
        leave: "请假",
        not: "缺勤",
        no: "",
      };
      return stateTagsMap[state];
    },
  },
  computed: {
    ...mapGetters(["userAttendance"]),
  },
  data() {
    return {
      attendanceRecords: [],
    };
  },
  methods: {
    getMyselfRecord() {
      const tempRecords = JSON.parse(
        JSON.stringify(this.userAttendance.attendanceRecords)
      );
      this.attendanceRecords = tempRecords.map((item) => {
        item.date = Moment(+item.date).format("YYYY-MM-DD");
        return item;
      });
    },
    attendanceState(data) {
      if (data.type === "current-month") {
        for (let item of this.attendanceRecords) {
          if (item.date === data.day) return item.state;
        }
        return "wait";
      }
      return "no";
    },
  },
  created() {
    this.$bus.$on("refreshCanlendar", this.getMyselfRecord);
  },
};
</script>

<style lang="scss" scoped>
.no {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
}
.not {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fef0f0;
  border: 2px solid #fde2e2;
  color: #c03131;
  border-radius: 10px;
  div {
    margin: 5px;
  }
}
.leave {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ecf5ff;
  border: 2px solid #d9ecff;
  color: #277bce;
  border-radius: 10px;
  div {
    margin: 5px;
  }
}
.abnormal {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fdf6ec;
  border: 2px solid #faecd8;
  color: #da9637;
  border-radius: 10px;
  div {
    margin: 5px;
  }
}
.normal {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f0f9eb;
  border: 2px solid #e1f3d8;
  color: #5db92e;
  border-radius: 10px;
  div {
    margin: 5px;
  }
}
.wait {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #f4f4f5;
  border: 2px solid #e9e9eb;
  color: #868686;
  border-radius: 10px;
  div {
    margin: 5px;
  }
}

.canlendar-cell {
  width: 100%;
  height: 100%;
  padding: 8px;
}

.is-selected {
  color: #1989fa;
}

.mycalendar {
  .el-card__body {
    width: 600px;
    height: 600px;
  }
}
</style>