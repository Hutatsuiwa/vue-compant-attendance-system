<!--
 * @Author: your name
 * @Date: 2022-04-06 14:33:48
 * @LastEditTime: 2022-04-22 23:05:30
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \vue-company-attendance-system\src\views\home\components\Attendance.vue
-->
<template>
  <el-card class="box-card">
    <!-- 卡片标题 -->
    <div slot="header" class="clearfix">
      <span>今日考勤</span>
    </div>

    <!-- 打卡界面 -->
    <div>
      <div class="box">
        <div>
          <div class="main">
            <div class="button-background">
              <el-button
                @click="openClick"
                @click.once="videoLoaded"
                circle
                plain
                :type="attendanceData.buttonType"
                :disabled="attendanceData.buttonDisabled"
                >{{ attendanceData.buttonMsg }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="time-floor">
        <el-steps align-center finish-status="finish" :active="3">
          <el-step
            title="上班"
            icon="el-icon-office-building"
            :description="attendanceData.goWorkTime"
          ></el-step>
          <el-step
            title="下班"
            icon="el-icon-house"
            :description="attendanceData.offWorkTime"
          ></el-step>
        </el-steps>
      </div>
    </div>

    <!-- 人脸识别考勤弹出框 -->
    <el-dialog
      title="人脸识别"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="closeCamera"
    >
      <!-- 步骤条 -->
      <el-steps
        :active="active"
        finish-status="success"
        :process-status="stepFlag"
        align-center
      >
        <el-step title="人脸识别"></el-step>
        <el-step title="活体检测"></el-step>
        <el-step title="人脸匹配"></el-step>
      </el-steps>

      <!-- 消息提示部分 -->
      <el-divider
        ><span class="face-info">{{ this.face.info }}</span></el-divider
      >

      <!-- 人脸识别位置 -->
      <div class="myface">
        <div class="canvascontainer">
          <canvas id="facecanvas"></canvas>
        </div>
        <div class="videocontainer">
          <video id="facevideo" muted></video>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeClick">取 消</el-button>
        <el-button
          :type="buttomType"
          @click="finishButton"
          :disabled="!face.matchResult"
          >{{ buttonMsg }}</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import * as faceapi from "face-api.js";
import { mapGetters } from "vuex";
import Moment from "moment";
export default {
  data() {
    return {
      //页面展示相关
      dialogVisible: false,
      active: 0,
      stepFlag: "wait",
      buttomType: "primary",
      finishButton: "",
      buttonMsg: "完 成",

      //人脸检测-匹配相关
      face: {
        video: "",
        canvas: "",
        MediaStreamTrack: "",
        IntervalId: "",
        isFace: false,
        isAlive: false,
        hasSendRequest: false,
        isFinish: false,
        matchResult: 0, //0-等待，1-成功，2-失败
        info: "",
        expression: -1,
        photo: "",
      },

      //登录用户当日考勤数据
      attendanceData: {
        goWorkTime: "00:00",
        offWorkTime: "00:00",
        buttonType: "danger",
        buttonDisabled: true,
        buttonMsg: "不在公司",
        myIP: undefined,
      },
    };
  },
  watch: {
    //实现进度条变化
    face: {
      handler(newV) {
        if (newV.isFace == false) this.active = 0;
        if (newV.isFace == true) this.active = 1;
        if (newV.isAlive == true) this.active = 2;
        if (newV.matchResult == 1) {
          this.active = 3;
          this.buttomType = "primary";
          this.finishButton = this.closeClick;
        }
        if (newV.matchResult == 2) {
          this.stepFlag = "error";
          this.buttomType = "warning";
          this.buttonMsg = "重 置";
          this.finishButton = this.faceReset;
        }
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["userAttendance"]),
  },
  methods: {
    //点击事件
    openClick() {
      this.$nextTick(() => {
        this.face.MediaStreamTrack = "";
        this.faceReset();
        this.openCamera();
      });
      this.dialogVisible = true;
    },
    closeClick() {
      this.closeCamera();
      this.dialogVisible = false;
    },

    //初始化
    //由于dialog是懒加载的,因此在初次加载时需要用nextTick处理,否则读取不到video元素
    videoLoaded() {
      this.$nextTick(() => {
        this.faceInit();
      });
    },
    //面部检测初始化
    faceInit() {
      this.face.video = document.getElementById("facevideo");
      this.face.canvas = document.getElementById("facecanvas");
      this.face.video.addEventListener("play", () => {
        // 配置显示尺寸
        const displaySize = {
          width: 533.33,
          height: 400,
        };
        faceapi.matchDimensions(this.face.canvas, displaySize);

        // 每 500ms 去绘制
        this.face.IntervalId = setInterval(async () => {
          // 识别位置, 路阔, 表情
          const detections = await faceapi
            .detectAllFaces(
              this.face.video,
              new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks()
            .withFaceExpressions();

          // 调整尺寸
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          this.face.canvas
            .getContext("2d")
            ?.clearRect(0, 0, this.face.canvas.width, this.face.canvas.height); // 清空画布
          faceapi.draw.drawFaceLandmarks(this.face.canvas, resizedDetections); // 轮阔
          this.check(detections);
        }, 200);
      });
      setTimeout(async () => {
        // 加载 models

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ]);
      }, 1000);
    },

    // 打开与关闭摄像头
    openCamera() {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;

          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      const constraints = {
        video: true,
        audio: false,
      };
      let promise = navigator.mediaDevices.getUserMedia(constraints);
      promise
        .then((stream) => {
          //保存stream，用于关闭
          this.face.MediaStreamTrack =
            typeof stream.stop === "function" ? stream : stream.getTracks()[0];

          // 旧的浏览器可能没有srcObject
          if ("srcObject" in this.face.video) {
            this.face.video.srcObject = stream;
          } else {
            // 防止再新的浏览器里使用它，应为它已经不再支持了
            this.face.video.src = window.URL.createObjectURL(stream);
          }
          this.face.video.play();
        })
        .catch((err) => {
          console.error(err.name + ": " + err.message);
        });
    },
    closeCamera(done) {
      if (this.face.MediaStreamTrack) {
        this.face.MediaStreamTrack.stop();
      } else {
        setTimeout(() => {
          this.face.MediaStreamTrack && this.face.MediaStreamTrack.stop();
        }, 1500);
      }
      clearInterval(this.face.IntervalId);
      if (done) done();
    },

    //拍照功能
    photo() {
      if (this.face.photo === "") {
        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        let video = document.getElementById("facevideo");
        canvas.width = 533.33;
        canvas.height = 400;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.face.photo = canvas.toDataURL("image/png");
      }
    },

    //人脸检测-匹配
    //人脸数量检测
    checkLength(length) {
      if (length == 1) return true;
      //没有人脸
      if (length == 0) {
        this.face.info = "请对准相机";
      }
      //人脸过多
      else if (length > 1) {
        this.face.info = "镜头前人脸数过多";
      }
      return false;
    },
    //人脸活体检测
    checkAlive(face) {
      const humanFace = face;
      //确认人脸
      if (humanFace.detection.score > 0.5) {
        this.face.isFace = true;
      }
      //选择检测表情
      if (this.face.expression == -1) {
        if (Math.round(Math.random()) > 0.5) {
          this.face.expression = 1;
        } else {
          this.face.expression = 2;
        }
      } else if (this.face.expression == 1) {
        this.face.info = "正在进行活体检测,请微笑";
      } else {
        this.face.info = "正在进行活体检测,请张嘴";
      }
      //检测表情判断
      if (
        (this.face.expression == 1 && humanFace.expressions.happy >= 0.95) ||
        (this.face.expression == 2 &&
          (humanFace.expressions.surprised >= 0.95 ||
            humanFace.expressions.angry >= 0.95))
      ) {
        this.face.isAlive = true;
        this.face.info = "活体检测通过!";
        return true;
      }
      return false;
    },
    //检测主函数
    check(detections) {
      if (this.face.isFinish || this.face.hasSendRequest) return;
      //人脸数量检测
      if (!this.checkLength(detections.length)) {
        this.face.isFace = false;
        this.face.isAlive = false;
        return;
      }
      this.photo();
      //人脸活体检测
      if (!this.checkAlive(detections[0])) {
        return;
      }
      //发送人脸匹配请求
      this.sendFaceRequest();
    },
    //发送匹配请求
    sendFaceRequest() {
      if (this.face.isFinish) {
        return;
      }
      if (this.face.hasSendRequest) {
        return;
      }
      this.face.hasSendRequest = true;
      this.face.info = "人脸匹配中...";
      const user = {
        faceImg: this.face.photo,
      };
      this.$store
        .dispatch("attendance/faceMatch", user)
        .then(() => {
          this.face.isFinish = true;
          this.face.matchResult = 1;
          this.face.info = "人脸匹配成功，打卡完成";
          this.$bus.$emit("getAttendance");
        })
        .catch(() => {
          this.face.isFinish = true;
          this.face.matchResult = 2;
          this.face.info = "人脸匹配失败，打卡失败";
        });
    },

    //重置检测
    faceReset() {
      this.stepFlag = "wait";
      this.buttomType = "primary";
      this.finishButton = "";
      this.buttonMsg = "完 成";
      this.face.isFace = false;
      this.face.isAlive = false;
      this.face.hasSendRequest = false;
      this.face.isFinish = false;
      this.face.matchResult = 0;
      this.face.info = "";
      this.face.expression = -1;
      this.face.photo = "";
    },

    //考勤卡片初始化
    initCard() {
      this.attendanceData.goWorkTime = Moment(
        +this.userAttendance.goWorkTime
      ).format("HH:mm");
      this.attendanceData.offWorkTime = Moment(
        +this.userAttendance.offWorkTime
      ).format("HH:mm");

      if (
        this.attendanceData.myIP &&
        this.userAttendance.attendanceIPs.includes(this.attendanceData.myIP)
      ) {
        if (this.userAttendance.isGoWork && this.userAttendance.isOffWork) {
          this.attendanceData.buttonType = "success";
          this.attendanceData.buttonDisabled = true;
          this.attendanceData.buttonMsg = "本日结束";
        }

        if (!this.userAttendance.isOffWork) {
          this.attendanceData.buttonDisabled = false;
          this.attendanceData.buttonMsg = "下班签退";
          if (
            Moment(+this.userAttendance.offWorkTime).hour() <= Moment().hour()
          ) {
            this.attendanceData.buttonType = "primary";
          } else {
            this.attendanceData.buttonType = "warning";
          }
        }

        if (!this.userAttendance.isGoWork) {
          this.attendanceData.buttonDisabled = false;
          this.attendanceData.buttonMsg = "上班签到";
          if (
            Moment(+this.userAttendance.goWorkTime).hour() >= Moment().hour()
          ) {
            this.attendanceData.buttonType = "primary";
          } else {
            this.attendanceData.buttonType = "warning";
          }
        }
      }
    },
    setIPAndRefresh(IP) {
      this.attendanceData.myIP = IP;
      this.initCard();
    },
  },
  created() {
    this.$bus.$on("refreshAttendance", this.initCard);
    this.$bus.$on("getIPRefresh", this.setIPAndRefresh);
  },
  beforeDestroy() {
    this.closeCamera();
  },
};
</script>

<style lang="scss" scoped>
.myface {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  .canvascontainer {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    border-radius: 50%;
    width: 400px;
    height: 400px;
    #facecanvas {
      width: 533.33px;
      height: 400px;
    }
  }
  .videocontainer {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-sizing: content-box;
    border: 20px solid rgb(199, 199, 199);
    width: 400px;
    height: 400px;
    background-color: #000;
    #facevideo {
      border-radius: 50%;
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  align-items: center;
}

.face-info {
  font-size: 16px;
  font-weight: bold;
  color: rgb(223, 120, 120);
}

.main {
  height: 155px;
  display: flex;
  justify-content: center;
  .button-background {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
    width: 120px;
    background-color: rgb(245, 244, 244);
    border-radius: 50%;
    .el-button {
      height: 100px;
      width: 100px;
    }
  }
}
</style>