<template>
  <el-container class="applyBox">
    <el-card class="box-card">
      <!-- 头部 -->
      <div slot="header" class="clearfix">
        <div style="float: left; margin-top: 10px">请假申请</div>
        <el-button
          style="float: right; margin-right: 10px"
          type="primary"
          icon="el-icon-upload2"
          @click="handlerApply"
          >提交申请</el-button
        >
      </div>

      <!-- 表单部 -->
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="leaveTemp"
        label-width="100px"
      >
        <!-- 请假类型 -->
        <el-form-item label="请假类型:" prop="type">
          <el-select
            style="width: 250px"
            v-model="leaveTemp.type"
            placeholder="请选择请假类型"
          >
            <el-option
              v-for="item in leaveTypeOptions"
              :key="item"
              :label="item | leaveTypesFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="请假日期:" prop="date">
          <el-date-picker
            style="width: 250px"
            v-model="leaveTemp.date"
            type="date"
            placeholder="选择日期"
            :editable="false"
            :picker-options="pickerOptions"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="请假缘由:" prop="detail">
          <el-input
            style="padding-right: 15px"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="请输入缘由"
            v-model="leaveTemp.detail"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Dashboard",
  filters: {
    //类型-文字转换器
    leaveTypesFilter(type) {
      const leaveTypesMap = {
        affair: "事假",
        illness: "病假",
        marry: "婚嫁",
        dead: "丧假",
        birth: "产假",
      };
      return leaveTypesMap[type];
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      // 模板数据-请假相关
      leaveTemp: {
        type: "",
        date: "",
        detail: "",
      },

      //下拉列表选项
      leaveTypeOptions: ["affair", "illness", "marry", "dead", "birth"],

      // 验证规则
      rules: {
        type: [
          {
            required: true,
            message: "请假类型不能为空",
            trigger: "change",
          },
        ],
        date: [
          {
            required: true,
            message: "请假日期不能为空",
            trigger: "change",
          },
        ],
        detail: [
          {
            required: true,
            message: "请假缘由不能为空",
            trigger: "change",
          },
        ],
      },

      //日期选择器限制
      pickerOptions: {
        disabledDate(data) {
          return data.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  methods: {
    // 重置模板数据
    resetLeave() {
      this.leaveTemp = {
        type: "",
        date: "",
        detail: "",
      };
    },

    // 提交申请
    handlerApply() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.leaveTemp);
          this.$store.dispatch("leave/apply", tempData).then(() => {
            this.$notify({
              title: "成功",
              message: "申请提交成功",
              type: "success",
              duration: 2000,
            });
            this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
            });
            this.resetLeave();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.applyBox {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-card {
  width: 40%;
}
</style>
