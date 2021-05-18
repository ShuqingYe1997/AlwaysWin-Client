<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
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
      timeline: [
        {
          timestamp: '2021-5-17',
          title: 'First purchase',
          content: 'You made your first bid on 2021-5-17'
        },
        {
          timestamp: this.user.regisDate,
          title: 'Welcome to AlwaysWin!',
          content: 'You became a member of AlwaysWin on ' + this.user.regisDate
        }
      ]
    }
  }
}
</script>
