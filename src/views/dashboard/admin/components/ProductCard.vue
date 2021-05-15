<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://ss7.vzw.com/is/image/VerizonWireless/iphone-12-pro-pacific-blue">
    </div>
    <div style="position:relative;">
      <pan-thumb :image="avatar" class="panThumb" />
      <span class="price">$100.00</span>
      <div style="padding-top:35px;" class="title-item">
        <span>IPhone XS</span>
      </div>
      <div class="description-item">
        <span>Almost new IPhone XS. Original Pack. White. </span>
      </div>
      <div class="start-item">
        <Countdown deadline="2021/08/13" />
      </div>
      <div>
        <el-button style="width: 90%" type="primary" @click.prevent.stop="guide">
          Bid
        </el-button>
        <el-button class="svg-icon" style="background: star" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Countdown from 'vuejs-countdown'

export default {
  components: { PanThumb, Countdown },

  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ])
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .title-item {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
  }

  .description-item {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .start-item {
    position: relative;
    text-align: left;
        color: #d6882f;
    top: 0px;
    right: 0px;
    font-size: 16px;
    font-weight: bold;
  }

.end-item {
    position: relative;
    text-align: left;
        color: #2fd690;
    top: 0px;
    right: 0px;
    font-size: 16px;
    font-weight: bold;
  }

  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }

.svg-icon {
      position: absolute;
      align-self: center;
      margin-top: 10px;
      margin-left: 10px;

    }

.username {
    position: relative;
    text-align: left;
        color: #000000;
    top: 0px;
    margin-left: 70px;
    right: 0px;
    font-size: 16px;
  }

  .price {
    position: absolute;
    text-align: right;
    color: #1ec9ba;
    top: 0px;
    right: 0px;
    font-size: 24px;
    font-weight: bold;
  }

}
</style>
