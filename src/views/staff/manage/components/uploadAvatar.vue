<template>
  <div>
    <el-upload
      ref="uploadAvatar"
      :class="{ disabled: uploadDisabled }"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :limit="1"
      :multiple="false"
      :file-list="fileList"
      :on-change="handleChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "uploadAvatar",
  props: ["dialogFormVisible", "avatar"],
  data() {
    return {
      imageUrl: "",
      dialogImageUrl: "",
      dialogVisible: false,
      haveLoad: true,
      uploadDisabled: false,
      fileList: [],
    };
  },
  methods: {
    handleRemove(file, fileList) {
      setTimeout(() => {
        this.uploadDisabled = false;
      }, 1000);
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleChange(file, fileList) {
      console.log(fileList);
      const isJPG = file.raw.type === "image/jpeg";
      const isPNG = file.raw.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("请上传JPG或PNG!");
        this.clearFileList();
        return;
      }
      if (!isLt2M) {
        this.$message.error("请保证文件大小在2MB以内!");
        this.clearFileList();
        return;
      }
      if (fileList.length >= 1) {
        this.uploadDisabled = true;
        this.fileToBase64(file.raw).then((res) => {
          this.$emit("changeAvatar", res);
        });
      }
    },

    clearFileList() {
      this.uploadDisabled = false;
      this.$refs.uploadAvatar.clearFiles();
    },

    fileToBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },

    base64ToFile(base64Data) {
      // 将base64转换为blob
      function dataURLtoBlob(dataurl) {
        let arr = dataurl.split(","),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
      }
      // 将blob转换为file
      function blobToFile(theBlob, fileName) {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
      }
      // 调用
      let blob = dataURLtoBlob(base64Data);
      let file = blobToFile(blob, "头像");
      return file;
    },
  },
  watch: {
    dialogFormVisible() {
      if (this.dialogFormVisible === false) {
        this.clearFileList();
      }
    },
  },
};
</script>

<style scope>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

