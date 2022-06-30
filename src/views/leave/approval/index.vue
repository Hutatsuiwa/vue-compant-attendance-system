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
        placeholder="申请类型"
        clearable
        style="margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in leaveTypeOptions"
          :key="item"
          :label="item | leaveTypesFilter"
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

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            @click="handleDecide(row, 'agree')"
          >
            同意
          </el-button>

          <el-button
            size="mini"
            type="danger"
            @click="handleDecide(row, 'reject')"
          >
            否决
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
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive //自定义指令
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination //页码组件
import Moment from "moment";

export default {
  name: "LeaveApproval",
  components: { Pagination },
  directives: { waves },
  filters: {
    //请假类型转换器
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
      listLoading: true, //列表加载效果

      //界面设置
      sortOptions: [
        //排序参数下拉栏内容
        { label: "ID 正序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],
      leaveTypeOptions: ["affair", "illness", "marry", "dead", "birth"], //请假类型下拉列表选项
      leaveStateOptions: ["wait", "agree", "reject"], //请假状态下拉列表选项

      //返回记录
      list: null, //后端返回的记录集合
      total: 0, //后面记录总数

      //请求参数
      listQuery: {
        page: 1, //页面
        limit: 20, //页面展示记录数量
        date: undefined,
        leaveState: "wait",
        leaveType: undefined,
        staffName: undefined,
        sort: "+id", //列表排序反转
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //搜索相关
    //获取列表数据
    getList() {
      this.listLoading = true;
      this.$store
        .dispatch("leave/getWaiting", this.listQuery)
        .then((waitingList) => {
          this.list = waitingList.lists;
          this.total = waitingList.total;

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

    //触发操作
    handleDecide(row, state) {
      const record = {
        id: row.id,
        state: state,
      };
      this.$store.dispatch("leave/decide", record).then(() => {
        this.$notify({
          title: "成功",
          message: "已" + (state === "agree" ? "同意" : "拒绝"),
          type: "success",
          duration: 2000,
        });
        this.getList();
      });
    },
  },
};
</script>