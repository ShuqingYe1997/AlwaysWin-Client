<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <router-link
      :to="'/product/' + product.pid"
    >
      <div>
        <div slot="header" class="box-card-header">
          <img
            :src="product.url"
            fit="contain"
            lazy
          >
        </div>
        <div style="position:relative;">
          <div>
            <el-tooltip trigger="hover" effect="dark" placement="top" content="Current Price">
              <div class="price">${{ product.price | toThousandFilter }} </div>
            </el-tooltip>
            <el-tag
              :type="productStatus[product.status].type"
              disable-transitions
              effect="plain"
              style="margin-top: 10px"
            >{{ productStatus[product.status].text }}
            </el-tag>
          </div>

          <div class="title-item">{{ product.title }} </div>
        </div>
      </div>
    </router-link>

    <div
      v-if="product.status === 'waiting'"
      class="waiting-item"
    >
      Time before starting
      <Countdown :deadline="product.startTime | formatDate1" />
    </div>
    <div
      v-if="product.status === 'bidding'"
      class="bidding-item"
    >
      Time before ending
      <Countdown :deadline="product.endTime | formatDate1" />
    </div>
    <div
      v-if="product.status.includes('extended')"
      class="extended-item"
    >
      The deadline is approaching!
      <Countdown :deadline="product.endTime | formatDate1" />
    </div>
    <div
      v-if="product.status === 'success' || product.status === 'broughtIn'"
      class="warning-item"
    >
      Auction has finished!
    </div>
    <div v-if="product.status === 'canceled'" class="warning-item">
      This product is canceled!
    </div>
    <div>
      <el-button class="icon-button" @click="handleUpdate()">
        <i :class="isFav? 'el-icon-star-on' : 'el-icon-star-off'" />
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { timeFromNow } from '@/filters/index'
import { productStatus } from '@/api/product'
import Countdown from 'vuejs-countdown'
import { checkInWishList, addToWishList, deleteFromWishList } from '@/api/wishlist'

export default {
  name: 'ProductCard',
  components: { Countdown },
  filters: {
    productTitleFilter(str) {
      if (str.length > 40) {
        return str.substring(0, 40) + '...'
      } else return str
    }
  },
  props: {
    product: {
      type: Object,
      default: null
    },
    uid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isFav: false,
      productStatus: productStatus()
    }
  },
  created() {
    checkInWishList(this.uid, this.product.pid).then((response) => {
      if (response.data === 1) {
        this.isFav = true
      }
    })
  },
  methods: {
    getTimeFromNow(timestamp) {
      return timeFromNow(timestamp)
    },
    handleUpdate() {
      if (this.uid === 0) {
        this.$message({
          message: 'Please login first!',
          type: 'warning'
        })
        return
      }
      if (!this.isFav) {
        const request_data = { uid: this.uid, pid: this.product.pid }
        addToWishList(request_data).then(response => {
          this.isFav = true
          this.$message({ message: 'Added to wish list', type: 'success' })
        })
      } else {
        deleteFromWishList(this.uid, this.product.pid).then(response => {
          this.isFav = false
          this.$message({ message: 'Removed from wish list', type: 'success' })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
  min-width: 200px;
  margin-right: 32px ;
  height: 510px; //焊死了
}
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
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }

  .title-item {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 10px;
    height: 100px;
  }

  .waiting-item {
    position: relative;
    text-align: center;
    color: #42b983;
    top: 0px;
    font-size: 16px;
  }

  .bidding-item {
    position: relative;
    text-align: center;
    color: #F7BA2A;
    top: 0px;
    font-size: 16px;
  }

  .extended-item {
    position: relative;
    text-align: center;
    color: #C03639;
    top: 0px;
    font-size: 16px;
}
  .warning-item {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #616b7a;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }

  .price {
    position: absolute;
    text-align: right;
    font-weight: bold;
    right: 0px;
    color: #42b983;
    font-size: 20px;
    padding-top: 10px;
    margin-right: 10px;
  }

  .icon-button,
  .icon-button:hover,
  .icon-button:active,
  .icon-button:after
  {
    padding: 10px;
    border: none;
    font-size: 25px;  // 设置按钮大小
    min-width: 20px;
    position: absolute;
    background: transparent;
  }
}
</style>
