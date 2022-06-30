<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- 查找条件：staffName -->
      <el-input
        v-model="listQuery.staffName"
        placeholder="申请人"
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

      <!-- 查找条件：leaveType-->
      <el-select
        v-model="listQuery.leaveType"
        placeholder="请假类型"
        clearable
        style="margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in leaveTypesOptions"
          :key="item"
          :label="item | leaveTypesFilter"
          :value="item"
        />
      </el-select>

      <!-- 查找条件：leaveState-->
      <el-select
        v-model="listQuery.leaveState"
        placeholder="请假类型"
        clearable
        style="margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in leaveStatesOptions"
          :key="item"
          :label="item | leaveStatesFilter"
          :value="item"
        />
      </el-select>

      <!-- 查找条件：leaderName -->
      <el-input
        v-model="listQuery.leaderName"
        placeholder="审核人"
        style="width: 100px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

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

      <!-- 姓名列 -->
      <el-table-column label="申请人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.staffName }}</span>
        </template>
      </el-table-column>

      <!-- 申请类型列 -->
      <el-table-column label="申请类型" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.leaveType | leaveTypesFilter }}</span>
        </template>
      </el-table-column>

      <!-- 申请状态列 -->
      <el-table-column label="申请状态" align="center">
        <template slot-scope="{ row }">
          <el-tag :type="row.leaveState | leaveTagsFilter">{{
            row.leaveState | leaveStatesFilter
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- 日期列 -->
      <el-table-column label="请假日期" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.date | dateFilter }}</span>
        </template>
      </el-table-column>

      <!-- 申请理由列 -->
      <el-table-column
        label="申请理由"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <span>{{ row.detail }}</span>
        </template>
      </el-table-column>

      <!-- 审核人列 -->
      <el-table-column label="审核人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.leaderName }}</span>
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
  name: "LeaveRecord",
  components: { Pagination },
  directives: { waves },
  filters: {
    //请假类型-文字转换器
    leaveTypesFilter(state) {
      const leaveTypesMap = {
        affair: "事假",
        illness: "病假",
        marry: "婚嫁",
        dead: "丧假",
        birth: "产假",
      };
      return leaveTypesMap[state];
    },
    //请假状态-文字转换器
    leaveStatesFilter(state) {
      const leaveStatesMap = {
        wait: "待审核",
        agree: "已同意",
        reject: "已否决",
      };
      return leaveStatesMap[state];
    },
    //请假状态-标签类型转换器
    leaveTagsFilter(state) {
      const leaveStatesMap = {
        wait: "info",
        agree: "success",
        reject: "danger",
      };
      return leaveStatesMap[state];
    },
    //日期转换器
    dateFilter(date) {
      return Moment(+date).format("YYYY-MM-DD");
    },
    //时间转换器
    timeFilter(time) {
      return Moment(+time).format("HH:mm:ss");
    },
  },
  data() {
    return {
      //界面效果标识
      listLoading: true, //列表加载效果标识
      dialogFormVisible: false, //修改弹出框标识

      //界面设置
      sortOptions: [
        //排序参数下拉列表内容
        { label: "ID 正序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],
      leaveTypesOptions: ["affair", "illness", "marry", "dead", "birth"], //请假类型下拉列表选项
      leaveStatesOptions: ["wait", "agree", "reject"], //请假状态下拉列表选项

      //返回记录
      list: null, //后端返回的记录集合
      total: 0, //后面记录总数

      //请求参数
      listQuery: {
        page: 1, //页面
        limit: 20, //页面展示记录数量
        date: undefined,
        leaveState: undefined,
        leaveType: undefined,
        staffName: undefined,
        leaderName: undefined,
        sort: "+id", //列表排序反转
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
        .dispatch("leave/getRecord", this.listQuery)
        .then((leaveRecord) => {
          this.list = leaveRecord.records;
          this.total = leaveRecord.total;

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
  },
};
</script>