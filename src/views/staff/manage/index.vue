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

      <!-- 日期列 -->
      <!-- <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column> -->

      <!-- 标题列 -->
      <!-- <el-table-column label="Title" min-width="150px">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.title
          }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column> -->

      <!-- 作者列 -->
      <!-- <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column> -->

      <!-- 评论列 -->
      <!-- <el-table-column
        v-if="showReviewer"
        label="Reviewer"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->

      <!-- 星级列 -->
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{ row }">
          <svg-icon
            v-for="n in +row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column> -->

      <!-- 阅读人数列 -->
      <!-- <el-table-column label="Readings" align="center" width="95">
        <template slot-scope="{ row }">
          <span
            v-if="row.pageviews"
            class="link-type"
            @click="handleFetchPv(row.pageviews)"
            >{{ row.pageviews }}</span
          >
          <span v-else>0</span>
        </template>
      </el-table-column> -->

      <!-- 状态列 -->
      <!-- <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column> -->

      <!-- 操作列 -->
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>

          <!-- <el-button
            v-if="row.status != 'published'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'published')"
          >
            Publish
          </el-button> -->

          <!-- <el-button
            v-if="row.status != 'draft'"
            size="mini"
            @click="handleModifyStatus(row, 'draft')"
          >
            Draft
          </el-button> -->

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
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- 本人照片 -->
        <el-form-item label="本人照片" prop="avatar">
          <upload-avatar
            @changeAvatar="changeAvatar"
            :dialogFormVisible="this.dialogFormVisible"
            :avatar="temp.avatar"
            v-model="temp.avatar"
          ></upload-avatar>
        </el-form-item>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="temp.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            v-model="temp.checkPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 身份 -->
        <el-form-item label="身份" prop="role">
          <el-select
            v-model="temp.role"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rolesOptions"
              :key="item"
              :label="item | rolesFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>

        <!-- 部门 -->
        <el-form-item label="部门" prop="department">
          <el-input v-model="temp.department" />
        </el-form-item>

        <!-- 职位 -->
        <el-form-item label="职位" prop="position">
          <el-input v-model="temp.position" />
        </el-form-item>
      </el-form>

      <!-- 底部操作部分 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive //自定义指令
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination //页码组件
import Description from "./components/description.vue";
import uploadAvatar from "./components/uploadAvatar.vue";

export default {
  name: "staffManage",
  components: { Pagination, Description, uploadAvatar },
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
  watch: {
    //监视器-实现头像、密码验证器必要性的修改
    dialogStatus(newV) {
      if (newV === "create") {
        this.rules.avatar[0].required = true;
        this.rules.password[0].required = true;
        this.rules.checkPassword[0].required = true;
      } else if (newV === "update") {
        this.rules.avatar[0].required = false;
        this.rules.password[0].required = false;
        this.rules.checkPassword[0].required = false;
      }
    },
  },
  data() {
    //自定义验证器-手机号
    let validatePhone = (rule, value, callback) => {
      if (
        (value?.length !== 0 && value?.match(/\D/) !== null) ||
        (value?.length !== 0 && value?.length !== 11)
      ) {
        callback(new Error("请输入正确的手机格式"));
      } else {
        callback();
      }
    };
    //自定义验证器-密码
    let validatePass = (rule, value, callback) => {
      if (value === "" && this.dialogStatus === "create") {
        callback(new Error("请输入密码"));
      } else {
        if (this.temp.checkPass !== "" && this.dialogStatus === "create") {
          this.$refs["dataForm"].validateField("checkPassword"); //为了触发再次输入密码的校验功能
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "" && this.dialogStatus === "create") {
        callback(new Error("请再次输入密码"));
      } else if (
        value !== this.temp.password &&
        this.dialogStatus === "create"
      ) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //界面效果标识
      listLoading: true, //列表加载效果
      dialogFormVisible: false, //弹出框展示标记

      //界面设置
      rolesOptions: ["staff", "leader", "admin"], //身份下拉列表选项
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
        role: undefined, //身份
        department: undefined, //部门
        name: undefined, //搜索标题限制
        sort: "+id", //列表排序反转
      },

      // 模板数据
      temp: {
        id: undefined,
        name: "",
        password: undefined,
        checkPassword: undefined,
        avatar: undefined,
        role: "",
        roles: [],
        phone: "",
        email: "",
        department: "",
        position: "",
      },

      //表单验证规则
      rules: {
        //key为表单组件中的prop属性值
        avatar: [
          { required: true, message: "照片不能为空", trigger: "change" },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "change" }],
        role: [{ required: true, message: "身份不能为空", trigger: "blur" }],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            required: true,
            validator: validatePass2,
            trigger: "blur",
          },
        ],
        phone: [
          {
            validator: validatePhone,
            trigger: "change",
          },
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱", trigger: "change" },
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

    //重置记录模板
    resetTemp() {
      this.temp = {
        id: undefined,
        username: undefined,
        name: "",
        password: undefined,
        checkPassword: undefined,
        avatar: undefined,
        role: "",
        roles: [],
        phone: "",
        email: "",
        department: "",
        position: "",
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
          this.$store.dispatch("staff/addStaff", tempData).then(() => {
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
      const {
        id,
        username,
        name,
        password = undefined,
        checkPassword = undefined,
        role,
        roles,
        phone,
        email,
        department,
        position,
      } = row;
      const staff = {
        id,
        username,
        name,
        password,
        checkPassword,
        avatar: undefined,
        role,
        roles,
        phone,
        email,
        department,
        position,
      };
      this.temp = staff; // copy obj
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
          this.$store.dispatch("staff/updateStaff", tempData).then(() => {
            this.dialogFormVisible = false;
            this.getList();
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

    //设置头像base64-修改功能
    changeAvatar(base64) {
      this.temp.avatar = base64;
    },

    //触发删除操作
    handleDelete(row, index) {
      this.$store.dispatch("staff/deleteStaff", { id: row.id }).then(() => {
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
