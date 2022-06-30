<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- 查找条件：name -->
      <el-input
        v-model="listQuery.name"
        placeholder="考勤人"
        style="width: 100px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <!-- 查找条件：date -->
      <el-date-picker
        v-model="listQuery.date"
        style="margin-right: 10px"
        type="date"
        placeholder="选择日期"
        value-format="timestamp"
      >
      </el-date-picker>

      <!-- 查找条件：goWorkState -->
      <el-select
        v-model="listQuery.goWorkState"
        placeholder="上班签到状态"
        clearable
        style="margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in goWorkStateOptions"
          :key="item"
          :label="item | goWorkStatesFilter"
          :value="item"
        />
      </el-select>

      <!-- 查找条件：offWorkState -->
      <el-select
        v-model="listQuery.offWorkState"
        placeholder="下班签到状态"
        clearable
        style="margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in offWorkStateOptions"
          :key="item"
          :label="item | offWorkStatesFilter"
          :value="item"
        />
      </el-select>

      <!-- 查找条件：sort -->
      <el-select
        v-model="listQuery.sort"
        style="width: 140px; margin-right: 10px"
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <!-- 查找按钮 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>

      <!-- 设置按钮 -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-setting"
        @click="handleSet"
      >
        设置考勤
      </el-button>
    </div>

    <!-- 表格本体 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <!-- ID列 -->
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- 日期列 -->
      <el-table-column label="日期" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date | dateFilter }}</span>
        </template>
      </el-table-column>

      <!-- 姓名列 -->
      <el-table-column label="考勤人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 上班签到状态列 -->
      <el-table-column label="上班签到状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.goWorkState | statesTagsFilter">{{
            row.goWorkState | goWorkStatesFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- 上班签到时间列 -->
      <el-table-column label="上班签到时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.goWorkTime | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- 下班签退状态列 -->
      <el-table-column label="下班签退状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.offWorkState | statesTagsFilter">{{
            row.offWorkState | offWorkStatesFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- 下班签退时间列 -->
      <el-table-column label="下班签退时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.offWorkTime | timeFilter }}</span>
        </template>
      </el-table-column>

      <!-- 联系电话列 -->
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>

          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 页码 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 弹出框-编辑 -->
    <el-dialog title="编辑考勤" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- 上班签到状态 -->
        <el-form-item label="上班签到状态" prop="goWorkState">
          <el-select
            v-model="temp.goWorkState"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in goWorkStateOptions"
              :key="item"
              :label="item | goWorkStatesFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 下班签退状态 -->
        <el-form-item label="下班签退状态" prop="offWorkState">
          <el-select
            v-model="temp.offWorkState"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in offWorkStateOptions"
              :key="item"
              :label="item | offWorkStatesFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
        <el-button type="primary" @click="updateData"> 确认 </el-button>
      </div>
    </el-dialog>

    <!-- 弹出框-设置-->
    <el-dialog
      title="考勤设置"
      :visible.sync="dialogSetFormVisible"
      width="700px"
    >
      <el-form
        ref="dataSetForm"
        :rules="rules"
        :model="setTemp"
        label-position="left"
        label-width="120px"
        style="width: 400px; margin-left: 50px"
        class="option"
      >
        <!-- 考勤签到时间设置 -->
        <el-form-item label="考勤时间设置" prop="time">
          <el-time-picker
            is-range
            v-model="setTemp.time"
            range-separator="|"
            start-placeholder="上班签到时间"
            end-placeholder="下班签退时间"
            placeholder="选择考勤时间"
            value-format="timestamp"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item
          v-for="(ip, index) in setTemp.attendanceIPs"
          :label="'IP地址' + index"
          :key="ip.key"
          :prop="'attendanceIPs.' + index + '.value'"
          :rules="{
            required: true,
            message: 'IP地址不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="ip.value"></el-input
          ><el-button @click.prevent="removeIp(ip)">删除</el-button>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetFormVisible = false"> 取消</el-button>
        <el-button @click="addIp">新增域名</el-button>
        <el-button type="primary" @click="updateTime()"> 确认 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive //自定义指令
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination //页码组件
import { mapGetters } from "vuex";
import Moment from "moment";

export default {
  name: "AttendanceManage",
  components: { Pagination },
  directives: { waves },
  computed: {
    ...mapGetters(["userAttendance"]),
  },
  filters: {
    //上班状态-汉字转换器
    goWorkStatesFilter(state) {
      const goWorkStatesMap = {
        wait: "待签到",
        normal: "正常",
        late: "迟到",
        leave: "请假",
        not: "未签到",
      };
      return goWorkStatesMap[state];
    },
    //下班状态-汉字转换器
    offWorkStatesFilter(state) {
      const offWorkStatesMap = {
        wait: "待签退",
        normal: "正常",
        early: "早退",
        leave: "请假",
        not: "未签退",
      };
      return offWorkStatesMap[state];
    },
    //状态-标签颜色转换器
    statesTagsFilter(state) {
      const offWorkStatesMap = {
        wait: "info",
        normal: "success",
        late: "warning",
        early: "warning",
        leave: "",
        not: "danger",
      };
      return offWorkStatesMap[state];
    },
    //日期格式转换器
    dateFilter(date) {
      if (date) {
        return Moment(+date).format("YYYY-MM-DD");
      } else {
        return null;
      }
    },
    //时间格式转换器
    timeFilter(time) {
      if (time) {
        return Moment(+time).format("HH:mm:ss");
      } else {
        return null;
      }
    },
  },
  data() {
    return {
      //界面效果标识
      listLoading: true, //列表加载效果标识
      dialogFormVisible: false, //修改弹出框标识
      dialogSetFormVisible: false, //设置弹出框标识

      //界面设置
      rolesOptions: ["staff", "leader", "admin"], //身份下拉列表选项
      sortOptions: [
        //排序参数下拉列表内容
        { label: "ID 正序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],
      goWorkStateOptions: ["wait", "normal", "late", "leave", "not"], //上班状态下拉列表选项
      offWorkStateOptions: ["wait", "normal", "early", "leave", "not"], //下班状态下拉列表选项

      //返回记录
      list: null, //后端返回的记录集合
      total: 0, //后面记录总数

      //请求参数
      listQuery: {
        page: 1, //页面
        limit: 20, //页面展示记录数量
        date: undefined,
        goWorkState: undefined,
        offWorkState: undefined,
        name: undefined,
        sort: "+id", //列表排序反转
      },

      //模板数据,用于展示列表
      temp: {
        id: undefined,
        goWorkState: "",
        offWorkState: "",
      },

      //模板数据2,用于设置功能
      setTemp: {
        time: "",
        attendanceIPs: [
          {
            value: "",
          },
        ],
      },

      //表单验证规则
      rules: {
        //key为表单组件中的prop属性值
        goWorkState: [
          {
            required: true,
            message: "上班签到状态状态不能为空",
            trigger: "change",
          },
        ],
        offWorkState: [
          {
            required: true,
            message: "下班签退状态状态不能为空",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "时间不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.$store.dispatch("user/getAttendance");
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = true;
      this.$store
        .dispatch("attendance/getRecord", this.listQuery)
        .then((attendanceRecord) => {
          this.list = attendanceRecord?.records;
          this.total = attendanceRecord?.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 0.5 * 1000);
        });
    },

    //启动搜索，默认第一页
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    //修改排序
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },

    //通过ID排序
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },

    //设置排序
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },

    //重置记录模板
    resetTemp() {
      this.temp = {
        id: undefined,
        goWorkState: "",
        offWorkState: "",
      };
    },

    //重置记录模板
    resetSetTemp() {
      this.setTemp = {
        time: "",
        attendanceIPs: [
          {
            value: "",
          },
        ],
      };
    },

    //打开更新弹出框
    handleUpdate(row) {
      const { id, goWorkState, offWorkState } = row;
      this.temp = {
        id,
        goWorkState,
        offWorkState,
      }; // copy obj
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //更新数据
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          this.$store.dispatch("attendance/updateRecord", tempData).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },

    //打开考勤设置弹出框
    handleSet() {
      this.resetSetTemp();
      this.setTemp.time = [
        this.userAttendance.goWorkTime,
        this.userAttendance.offWorkTime,
      ];
      this.setTemp.attendanceIPs = this.userAttendance.attendanceIPs.map(
        (item, index) => {
          return {
            value: item,
            key: index,
          };
        }
      );
      this.dialogSetFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataSetForm"].clearValidate();
      });
    },

    //更新考勤时间
    updateTime() {
      const attendanceIPs = this.setTemp.attendanceIPs.map((item) => {
        return item.value;
      });
      const Data = {
        goWorkTime: this.setTemp.time[0],
        offWorkTime: this.setTemp.time[1],
        attendanceIPs,
      };
      this.$refs["dataSetForm"].validate((valid) => {
        if (valid) {
          const setTempData = Object.assign({}, Data);
          this.$store
            .dispatch("attendance/setAttendance", setTempData)
            .then(() => {
              this.dialogSetFormVisible = false;
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
                duration: 2000,
              });
            });
        }
      });
    },

    //触发删除操作
    handleDelete(row) {
      this.$store
        .dispatch("attendance/deleteRecord", { id: row.id })
        .then(() => {
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
          this.getList();
        });
    },

    removeIp(item) {
      var index = this.setTemp.attendanceIPs.indexOf(item);
      if (index !== -1) {
        this.setTemp.attendanceIPs.splice(index, 1);
      }
    },
    addIp() {
      this.setTemp.attendanceIPs.push([
        {
          value: "",
          key: Date.now(),
        },
      ]);
    },
  },
};
</script>
<style scoped>
.option .el-input {
  margin-right: 10px;
  width: 200px;
  vertical-align: top;
}
</style>
