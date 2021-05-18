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
              <el-tab-pane label="AddFund" name="addFund">
                <addFund :user="user" />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/user'
import UserCard from './components/UserCard'
import AddFund from './components/AddFund'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, AddFund, Account },
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
        balance: ''
      },
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'uid',
      'username',
      'portrait',
      'roles'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        this.list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
      this.user = {
        uid: this.uid,
        username: this.username,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        portrait: this.portrait
      }
    }
  }
}
</script>
