<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :username="username" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Wallet" name="wallet">
                <wallet />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
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
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Wallet from './components/Wallet'
import Account from './components/Account'
import Timeline from './components/Timeline'

export default {
  name: 'Profile',
  components: { UserCard, Wallet, Account, Timeline },
  data() {
    return {
      activeTab: 'wallet'
    }
  },
  computed: {
    ...mapGetters([
      'username'
    ])
  },
  methods: {

  }
}
</script>
