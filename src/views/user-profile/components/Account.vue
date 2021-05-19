<template>
  <el-form ref="dataForm" :rules="rules" :model="temp" style="margin-left:20px;">
    <el-form-item label="Current Password" label-width="200">
      <el-input
        v-model="temp.oldPassword"
        type="password"
        placeholder="Input your current password"
        tabindex="2"
        width="300px"
        autocomplete="on"
        @keyup.native="checkCapslock"
        @blur="capsTooltip = false"
      />
    </el-form-item>

    <el-form-item label="New Password" label-width="200">
      <el-input
        ref="password"
        v-model="temp.newPassword1"
        type="password"
        placeholder="Password should be 6~20 long with digits and letters, or underline"
        tabindex="2"
        width="300px"
        autocomplete="on"
        @keyup.native="checkCapslock"
        @blur="capsTooltip = false"
      />
    </el-form-item>

    <el-form-item label="New Password Again" label-width="200">
      <el-input
        v-model="temp.newPassword2"
        type="password"
        placeholder="Password should be 6~20 long with digits and letters, or underline"
        tabindex="2"
        width="300px"
        autocomplete="on"
        @keyup.native="checkCapslock"
        @blur="capsTooltip = false"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="updateData">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  data() {
    return {
      temp: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [{ required: true, min: 6, max: 20, message: 'Old password is required', trigger: 'blur' }],
        newPassword1: [{ required: true, min: 6, max: 20, pattren: /^[a-zA-Z0-9_]+$/, message: 'New password is required', trigger: 'blur' }],
        newPassword2: [{ required: true, min: 6, max: 20, pattren: /^[a-zA-Z0-9_]+$/, message: 'Input your new password again', trigger: 'blur' }]
      }
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    resetTemp() {
      this.temp.oldPassword = ''
      this.temp.newPassword1 = ''
      this.temp.newPassword2 = ''
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          changePassword(this.temp).then((response) => {
            this.$message.success('Update Successfully')
          })
        }
      })
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
    }
  }
}
</script>
