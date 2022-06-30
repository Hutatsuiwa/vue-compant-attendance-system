<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-avatar :size="256" shape="square" :src="data.avatar" fits="contain">
      </el-avatar>
    </div>
    <el-descriptions class="margin-top" :column="3" size="mini" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-suitcase"></i>
          员工号
        </template>
        {{ data.username }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user"></i>
          姓名
        </template>
        {{ data.name }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-place"></i>
          身份
        </template>
        {{ data.role | rolesFilter }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-suitcase-1"></i>
          职位
        </template>
        {{ data.position }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          所属部门
        </template>
        {{ data.department }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile"></i>
          手机号
        </template>
        {{ data.phone }}
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-message"></i>
          邮箱
        </template>
        {{ data.email }}
      </el-descriptions-item>
    </el-descriptions>
  </el-card>
</template>

<script>
export default {
  name: "Description",
  props: ["data"],
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
};
</script>

<style lang="scss" scoped>
</style>