<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      :http-request="onRequest"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="1"
      :class="fileList.length ? 'hiden' : ''"
      :before-upload="beforeUpload"
      class="box"
      list-type="picture-card"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="previewImgDialog">
      <img :src="imgUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDpRnulLq9D1ZsviFXfX8TYMuHQKyMUMyJ',
  SecretKey: '81e17xVmmX2KM8fwxkIbdOt74kAJGxOa',
})
export default {
  name: 'UploadImg',
  data() {
    return {
      fileList: [],
      previewImgDialog: false,
      imgUrl: '',
      loading: false,
    }
  },

  created() {},

  methods: {
    // 发送请求时触发
    onRequest({ file }) {
      this.loading = true
      cos.putObject(
        {
          Bucket: 'hmhr-31-1313342210' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          },
        },
        (err, data) => {
              this.loading = false
          if (err && data.statusCode !== 200) {
            return this.$message.error('上传失败')
          }
          this.$emit('onSuccess', { url: 'https:' + data.Location })
        },
      )
      console.log('发送请求时触发')
    },
    // 上传成功或者失败时触发
    onChange(file, fileList) {
      console.log('上传成功或者失败时触发')
      this.fileList = fileList
    },
    // 删除图片时触发
    onRemove(file, fileList) {
      console.log('删除图片时触发')
      this.fileList = fileList
    },
    // 点击图片时触发
    onPreview(file) {
      this.previewImgDialog = true
      this.imgUrl = file.url
    },
    // 图片上传时触发
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/git', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('请选择' + types.join('、') + '图片')
        return false
      }
      const maxSize = 2 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片不能大于2Mb')
        return false
      }
      console.log('上传前检查', file)
    },
  },
}
</script>

<style scoped lang="scss">
.hiden.el-upload .el-upload--picture-card {
  display: none;
}
.box {
  width: 148px;
  height: 148px;
  overflow: hidden;
}
</style>
