<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>Hello, {{ user.username }}</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.portrait" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>
            <el-button icon="el-icon-upload" @click="imagecropperShow = true" />
          </div>
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.username }}</div>
      </div>
    </div>

    <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="http://44.192.52.170:8080//user/my-info/upload-icon"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    />

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="people" /><span>Gender</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.gender }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="email" /><span>Email</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.email }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="el-icon-phone" /><span>Phone</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.phone }}
          </div>
        </div>
      </div>

      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><i class="el-icon-date" /><span>Birthday</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.birthday }}
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'

export default {
  components: { PanThumb, ImageCropper },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          uid: undefined,
          username: '',
          portrait: '',
          phone: '',
          email: '',
          gender: '',
          birthday: '',
          regisDate: '',
          balance: 0
        }
      }
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: this.user.portrait
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = resData.files.avatar
    },
    close() {
      this.imagecropperShow = false
    }
  }
}
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
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
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
</style>
