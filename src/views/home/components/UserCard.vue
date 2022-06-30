<template>
  <el-card style="margin-bottom: 20px">
    <div slot="header" class="clearfix">
      <span>个人信息</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="user.avatar"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        >
          <div>你好</div>
          {{ user.name }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center name">{{ user.name }}</div>
        <hr />
        <div class="username">
          <i class="el-icon-user-solid"></i>
          <span>ID: {{ user.username }}</span>
        </div>
        <div class="user-role text-center text-muted">
          {{ user.role | rolesFilter }}
        </div>
        <div class="user-department text-center text-muted">
          {{ user.department }}
        </div>
        <div class="user-position text-center text-muted">
          {{ user.position }}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="education" /><span>介绍</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">本项目为基于人脸识别的企业管理系统</div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from "@/components/PanThumb";
import { mapGetters } from "vuex";

export default {
  components: { PanThumb },
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
      user: {
        username: "",
        name: "",
        avatar: "",
        role: "",
        department: "",
        position: "",
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    getUser() {
      this.user = {
        username: this.userInfo.username,
        name: this.userInfo.name,
        role: this.userInfo.role,
        avatar: this.userInfo.avatar,
        department: this.userInfo.department,
        position: this.userInfo.position,
      };
    },
  },
  created() {
    this.getUser();
  },
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
    .text-center {
      text-align: center;
    }
  }

  .user-role {
    padding-top: 5px;
    font-weight: 400;
    font-size: 15px;
    font-weight: bold;
  }

  .user-department {
    padding-top: 5px;
    font-weight: 400;
    font-size: 10px;
  }

  .user-position {
    padding-top: 5px;
    font-weight: 400;
    font-size: 10px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}

hr {
  height: 1px;
  background-color: rgb(221, 221, 221);
  border: none;
}

.username {
  background-color: rgb(73, 209, 250);
  color: #fff;
  border-radius: 25px;
  font-size: 15px;
  margin-top: 10px;
  padding: 2px 8px 2px 8px;
  .el-icon-user-solid {
    margin-right: 3px;
  }
}
</style>
