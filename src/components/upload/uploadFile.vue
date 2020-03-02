<template>
    <el-upload
        ref="upload"
        :action="uploadAPI"
        :headers="upLoadHeader"
        :on-success="uploadSuccess"
        :before-upload="fileType"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :limit="1"
        :on-exceed="handleExceed"
        :file-list="fileList"
    >
        <el-button
            size="small"
            type="primary"
        >点击上传</el-button>
        <div
            slot="tip"
            class="el-upload__tip"
        >{{ uploadInfo.placeholder }}</div>
    </el-upload>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    uploadInfo: {
      type: Object,
      default: () => {
        return {
          api: `/SERVICE-BUSINESS/api/file/upload`,
          type: "image", //  image/jpeg
          placeholder: "请上传png,jpg格式的图片" // 上传格式提示
        };
      }
    }
  },
  data() {
    return {
      // 传递token
      uploadToken: {
        Authorization: window.sessionStorage.getItem("Admin-Token")
      },
      // 上传路径
      uploadAPI: "",
      upLoadHeader: {
        Authorization: ""
      },
      fileList: [] // 文件列表
    };
  },
  mounted() {
    this.upLoadHeader.Authorization = window.sessionStorage.getItem(
      "Admin-Token"
    );
    this.uploadAPI = `${process.env.VUE_APP_BASE_API}${this.uploadInfo.api}`;
  },
  methods: {
    /* ========= 图片上传 start =======*/
    // 取消时候触发 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 文件`
      );
    },
    handleRemove(file, fileList) {
      this.$emit("uploadSuccess", { url: "" });
      this.fileList = [];
    },
    // 移除上传文件之前的钩子，询问是否移除
    beforeRemove(file, fileList) {
      console.log("%c " + 77, "color: red");
      if (file && file.name) {
        // this.$refs.upload.clearFiles()
        console.log(file);
        console.log(fileList);
        return this.$confirm(`确定移除？`);
      } else {
        return false;
      }
    },
    fileType(file) {
      if (
        file.type !== "image/jpg" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/png"
      ) {
        this.$message.warning("只能上传jpg、jpeg、png格式的图片，请重新上传！");
        this.$refs.upload.clearFiles();
        return false;
      } else if (file.size >= 1014 * 1024 * 4) {
        this.$message.warning("上传图片大小不能超过4M,请重新上传！");
        this.$refs.upload.clearFiles();
        return false;
      } else {
        return true;
      }
    },
    // 文件上传成功时执行钩子
    uploadSuccess(response, file, fileList) {
      let data = {
        name: file.name,
        url: response.data
      };
      this.$emit("uploadSuccess", data);
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
