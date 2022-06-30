<!--
 * @Author: your name
 * @Date: 2022-04-06 14:16:11
 * @LastEditTime: 2022-04-22 22:42:38
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-company-attendance-system\src\views\home\index.vue
-->
<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6" :push="3">
          <user-card></user-card>
          <attendance></attendance>
        </el-col>
        <el-col :span="12" :push="3">
          <el-card>
            <my-canlendar></my-canlendar>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <outer-ip></outer-ip>
  </div>
</template>

<script>
import UserCard from "./components/UserCard";
import Attendance from "./components/Attendance.vue";
import MyCanlendar from "./components/MyCanlendar.vue";
import OuterIp from "./components/OutIP.vue";

export default {
  name: "Home",
  components: { UserCard, Attendance, MyCanlendar, OuterIp },
  methods: {
    getMyselfAttendance() {
      this.$store.dispatch("user/getAttendance").then(() => {
        this.$bus.$emit("refreshAttendance");
        this.$bus.$emit("refreshCanlendar");
      });
    },
    getMyselfInfo() {
      this.$store.dispatch("user/getInfo");
    },
  },
  created() {
    this.getMyselfInfo();
    this.getMyselfAttendance();
    this.$bus.$on("getAttendance", this.getMyselfAttendance);
    // setTimeout(() => {
    //   console.log(returnCitySN);
    // }, 500);
  },
};
</script>
