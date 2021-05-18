<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Wallet" name="wallet">
                <wallet :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Change Password" name="account">
                <account />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
import UserCard from './components/UserCard'
import Wallet from './components/Wallet'
import Account from './components/Account'
import Timeline from './components/Timeline'

export default {
  name: 'Profile',
  components: { UserCard, Wallet, Account, Timeline },
  data() {
    return {
      user: {
        uid: undefined,
        username: '',
        portrait: '',
        phone: '',
        email: '',
        gender: '',
        birthday: '',
        regisDate: '',
        balance: 0
      },
      activeTab: 'wallet'
    }
  },

  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then(response => {
        console.log('data ' + response.data.regisDate)
        this.user = { ...response.data }
        setTimeout(() => {
        }, 1.5 * 1000)
      })
      console.log('user ' + this.user.regisDate)
      console.log('user ' + this.user.birthday)
      this.user.username = this.$store.getters.username
    }
  }
}
</script>
