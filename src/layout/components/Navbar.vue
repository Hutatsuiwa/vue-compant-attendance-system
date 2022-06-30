<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/myself/index">
            <el-dropdown-item> 个人信息 </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="handlerUpdate">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 弹出框-新增、编辑 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempData"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="tempData.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="checkPassword">
          <el-input
            type="password"
            v-model="tempData.checkPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="updatePassword"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  //读取头像和siderbar状态
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  data() {
    //自定义验证器
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.tempData.checkPass !== "") {
          this.$refs["dataForm"].validateField("checkPassword"); //为了触发再次输入密码的校验功能
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.tempData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      //弹出框标识
      dialogFormVisible: false,
      // 临时数据
      tempData: {
        password: "",
        checkPassword: "",
      },
      //验证规则
      rules: {
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
      },
    };
  },
  methods: {
    //切换sideBar状态
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    //用户登出
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },

    //修改密码相关
    //打开更改密码界面
    handlerUpdate() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.resetData();
        this.$refs["dataForm"].clearValidate();
      });
    },
    //更改密码
    updatePassword() {
      this.$store
        .dispatch("user/updatePassword", this.tempData)
        .then(() => {
          this.$notify({
            title: "成功",
            message: "修改成功",
            type: "success",
          });
        })
        .catch(() => {
          this.$notify({
            title: "失败",
            message: "修改失败",
            type: "error",
          });
        });
      this.dialogFormVisible = false;
    },
    //重置临时数据
    resetData() {
      this.tempData = {
        password: "",
        checkPassword: "",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
