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
import { getInfo } from '@/api/user'

export default {
  data() {
    return {
      timeline: null,
      regisDate: null
    }
  },
  created() {
    this.getTimeline()
  },
  methods: {
    getTimeline() {
      getInfo().then(response => {
        this.regisDate = response.data.regisDate
      })
      this.timeline = [{
        timestamp: '2021-5-17',
        title: 'First purchase',
        content: 'You made your first bid on 2021-05-17'
      },
      {
        timestamp: this.regisDate,
        title: 'Welcome to AlwaysWin!',
        content: 'You became a member of AlwaysWin!'
      }]
    }
  }
}
</script>
