<template>
  <div>
    <el-card style="margin-bottom:20px;">
      <div slot="header" class="clearfix">
        <el-button type="primary" icon="el-icon-edit" @click="handleUpdate()">Edit</el-button>
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
          <div class="user-name text-center">Hello, {{ username }}</div>
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

    <!--  pop up window  -->
    <el-dialog title="Edit" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="query" label-position="left" label-width="100px" style="width: 350px; margin-left:50px;">
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="query.gender" class="filter-item" width="300px">
            <el-option v-for="item in genderOptions" :key="item.key" :label="item.key" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="query.email" width="300px" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="query.phone" />
        </el-form-item>
        <el-form-item label="Birthday" prop="birthday">
          <el-date-picker v-model="query.birthday" type="date" value-format="yyyy-MM-dd" width="300px" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import ImageCropper from '@/components/ImageCropper'
import { getInfo, updateInfo } from '@/api/user'

const genderOptions = [
  { key: 'Female', value: 'female' },
  { key: 'Male', value: 'male' },
  { key: 'Other', value: 'other' },
  { key: 'Unknown', value: 'unknown' }
]

export default {
  components: { PanThumb, ImageCropper },
  props: {
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: '',
      dialogFormVisible: false,
      genderOptions,
      user: {
        uid: 0,
        portrait: '',
        phone: '',
        email: '',
        gender: '',
        birthday: '',
        regisDate: '',
        balance: 0
      },
      query: {
        portrait: '',
        phone: '',
        email: '',
        gender: '',
        birthday: '',
        balance: 0
      },
      rules: {
        phone: [{ pattern: /^[0-9]*$/, min: 6, max: 12, message: 'Please input a valid phone number', trigger: 'blur' }],
        email: [{ type: 'email', message: 'Please input a valid email address', trigger: ['blur', 'change'] }]
      }
    }
  },
  watch: {
    user: function() {
      this.image = this.user.portrait
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then(response => {
        this.user = { ...response.data }
      })
    },
    handleUpdate() {
      this.query = Object.assign({}, this.user) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      const tempData = Object.assign({}, this.query)
      console.log('birthday' + tempData.birthday)
      updateInfo(tempData).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
      // refresh
      this.user = Object.assign({}, this.query)
    },

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
