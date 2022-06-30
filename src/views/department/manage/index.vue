<template>
  <div class="app-container">
    <div class="filter-container" style="margin-bottom: 10px">
      <!-- 查找条件：name -->
      <el-input
        v-model="listQuery.name"
        placeholder="部门名"
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

      <!-- 添加按钮 -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
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

      <!-- 部门名列 -->
      <el-table-column label="部门名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>

          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
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

    <!-- 弹出框-新增、编辑 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="400px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 250px; margin-left: 50px"
      >
        <!-- 部门名 -->
        <el-form-item label="部门名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive //自定义指令
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination //页码组件

export default {
  name: "DepartmentManage",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      //界面效果标识
      listLoading: true, //列表加载效果
      dialogFormVisible: false, //弹出框展示标记

      //界面设置
      sortOptions: [
        //排序参数下拉栏内容
        { label: "ID 正序", key: "+id" },
        { label: "ID 倒序", key: "-id" },
      ],
      dialogStatus: "", //弹出框功能
      textMap: {
        //弹出框标题
        update: "编辑",
        create: "添加",
      },

      //返回记录
      list: null, //后端返回的记录集合
      total: 0, //后面记录总数

      //请求参数
      listQuery: {
        page: 1, //页面
        limit: 20, //页面展示记录数量
        name: undefined,
        sort: "+id", //列表排序反转
      },

      //模板数据
      temp: {
        id: undefined,
        name: "",
      },

      //表单验证规则
      rules: {
        //key为表单组件中的prop属性值
        name: [
          {
            required: true,
            message: "部门名不能为空",
            trigger: "change",
          },
        ],
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
        .dispatch("department/getList", this.listQuery)
        .then((departmentList) => {
          this.list = departmentList.departments;
          this.total = departmentList.total;

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
        name: "",
      };
    },

    //打开创建对话框
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    //创建数据
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.$store
            .dispatch("department/addDepartment", tempData)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "添加成功",
                type: "success",
                duration: 2000,
              });
            });
        }
      });
    },

    //打开更新对话框
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
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
          this.$store
            .dispatch("department/updateDepartment", tempData)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
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
    handleDelete(row, index) {
      this.$store
        .dispatch("department/deleteDepartment", { id: row.id })
        .then(() => {
          this.getList();
          this.$notify({
            title: "成功",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
        });
    },
  },
};
</script>