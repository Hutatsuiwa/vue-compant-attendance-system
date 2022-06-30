<template>
  <el-container class="my-box">
    <el-card class="box-card">
      <div slot="header" class="header">
        <el-avatar
          :size="256"
          shape="square"
          :src="myself.avatar"
          fits="contain"
        >
        </el-avatar>
        <el-button class="card-button" type="primary" @click="handlerUpdate"
          >修改信息</el-button
        >
      </div>
      <el-descriptions class="margin-top" :column="3" size="mini" border>
        <!-- 员工号 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-suitcase"></i>
            员工号
          </template>
          {{ myself.username }}
        </el-descriptions-item>

        <!-- 姓名 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ myself.name }}
        </el-descriptions-item>

        <!-- 身份 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-place"></i>
            身份
          </template>
          {{ myself.role | rolesFilter }}
        </el-descriptions-item>

        <!-- 职位 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-suitcase-1"></i>
            职位
          </template>
          {{ myself.position }}
        </el-descriptions-item>

        <!-- 所属部门 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            所属部门
          </template>
          {{ myself.department }}
        </el-descriptions-item>

        <!-- 手机号 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile"></i>
            手机号
          </template>
          {{ myself.phone }}
        </el-descriptions-item>

        <!-- 邮箱 -->
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            邮箱
          </template>
          {{ myself.email }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- 弹出框-编辑 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="updateData"> 确定 </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Myself",
  filters: {
    rolesFilter(role) {
      const rolesMap = {
        staff: "职员",
        leader: "领导",
        admin: "管理员",
      };
      return rolesMap[role];
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    //自定义验证器-手机号
    let validatePhone = (rule, value, callback) => {
      if (
        (value.length !== 0 && value.match(/\D/) !== null) ||
        (value.length !== 0 && value.length !== 11)
      ) {
        callback(new Error("请输入正确的手机格式"));
      } else {
        callback();
      }
    };
    return {
      myself: {
        username: "",
        avatar: "",
        name: "",
        role: "",
        position: "",
        department: "",
        phone: "",
        email: "",
      },
      temp: {
        phone: "",
        email: "",
      },
      dialogFormVisible: false,
      rules: {
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
  methods: {
    getMyself() {
      Object.assign(this.myself, this.userInfo);
    },
    getMyselfInfo() {
      this.$store.dispatch("user/getInfo");
    },
    handlerUpdate() {
      const { phone, email } = this.myself;
      this.temp = {
        phone,
        email,
      };
      this.dialogFormVisible = true;
    },
    updateData() {
      this.$store.dispatch("user/updateInfo", this.temp).then(() => {
        this.getMyself();
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success",
        });
      });
      this.dialogFormVisible = false;
    },
  },
  created() {
    this.getMyselfInfo();
    this.getMyself();
  },
};
</script>

<style lang="scss" scoped>
.my-box {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
.box-card {
  width: 80%;
}
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  .card-button {
  }
}
</style>
