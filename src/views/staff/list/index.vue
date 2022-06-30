<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- 查找条件：name -->
      <el-input
        v-model="listQuery.name"
        placeholder="姓名"
        style="width: 100px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <!-- 查找条件：department -->
      <el-input
        v-model="listQuery.department"
        placeholder="部门"
        style="width: 100px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <!-- 查找条件：role -->
      <el-select
        v-model="listQuery.role"
        placeholder="身份"
        clearable
        style="width: 90px; margin-right: 10px"
        class="filter-item"
      >
        <el-option
          v-for="item in rolesOptions"
          :key="item"
          :label="item | rolesFilter"
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
      <!-- 实现展开功能 -->
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <description :data="row"></description>
        </template>
      </el-table-column>

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
      <el-table-column label="姓名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 部门列 -->
      <el-table-column label="部门" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>

      <!-- 职位列 -->
      <el-table-column label="职位" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>

      <!-- 身份列 -->
      <el-table-column label="身份" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.role | rolesFilter }}</span>
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
import Description from "./components/description.vue";

export default {
  name: "StaffList",
  components: { Pagination, Description },
  directives: { waves },
  filters: {
    //权限-中文属性投影器
    rolesFilter(role) {
      const rolesMap = {
        staff: "职员",
        leader: "领导",
        admin: "管理员",
      };
      return rolesMap[role];
    },
  },
  data() {
    return {
      //界面效果标识
      listLoading: true, //列表加载效果

      //界面设置
      rolesOptions: ["staff", "leader", "admin"], //身份下拉列表选项
      sortOptions: [
        //排序参数下拉栏内容
        { label: "ID 正序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],

      //返回记录
      list: null, //后端返回的记录集合
      total: 0, //后面记录总数

      //请求参数
      listQuery: {
        page: 1, //页面
        limit: 20, //页面展示记录数量
        role: undefined, //身份
        department: undefined, //部门
        name: undefined, //搜索标题限制
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
        .dispatch("staff/getList", this.listQuery)
        .then((staffList) => {
          this.list = staffList.staffs;
          this.total = staffList.total;

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
