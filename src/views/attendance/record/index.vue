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
        placeholder="下班签退状态"
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
    </el-table>

    <!-- 页码 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive //自定义指令
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination //页码组件
import Moment from "moment";

export default {
  name: "AttendanceRecord",
  components: { Pagination },
  directives: { waves },
  filters: {
    //上午状态投影器
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
    //下午状态投影器
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
    //状态-标签颜色投影器
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
        date: "",
        name: "",
        goWorkState: "",
        goWorkTime: "",
        offWorkState: "",
        offWorkTime: "",
        phone: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //获取列表数据
    getList() {
      this.listLoading = true;
      this.$store
        .dispatch("attendance/getRecord", this.listQuery)
        .then((attendanceRecord) => {
          this.list = attendanceRecord.records;
          this.total = attendanceRecord.total;

          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 1000);
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
        date: "",
        name: "",
        goWorkState: "",
        goWorkTime: "",
        offWorkState: "",
        offWorkTime: "",
        phone: "",
      };
    },
  },
};
</script>
