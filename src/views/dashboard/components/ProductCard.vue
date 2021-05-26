<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <router-link :to="`/product/${productForm.pid}`">
      <div>
        <div slot="header" class="box-card-header">
          <img :src="`${productForm.thumbnail.url}`">
        </div>
        <div style="position:relative;">
          <pan-thumb :image="sellerInfo.portrait" class="panThumb" />
          <span class="price"> ${{ productForm.productStatus.price }} </span>
          <div class="title-item">
            <span> {{ productForm.title }}</span>
          </div>
          <div class="description-item">
            <span>{{ productForm.description }} </span>
          </div>
          <div v-if="bidAction === 'Place Your Offer'" class="end-item">
            <Countdown :deadline="timecountdown | formatDate1" />
          </div>
          <div v-else class="start-item">
            <Countdown :deadline="timecountdown | formatDate1" />
          </div>
        </div>
      </div>
    </router-link>
    <div style="position:relative;">
      <el-button v-if="bidAction === 'Place Your Offer'" style="width: 90%" type="primary" @click.prevent.stop="guide">
        {{ bidAction }}
      </el-button>
      <el-button v-else style="width: 90%" type="info" disabled>
        {{ bidAction }}
      </el-button>
      <el-button class="icon-button" @click="AddToFav()">
        <i :class="isFav? 'el-icon-star-on' : 'el-icon-star-off'" />
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Countdown from 'vuejs-countdown'
import { productDetail } from '@/api/product.js'
import { addToWishList, checkInWishList, deleteFromWishList } from '@/api/wishlist.js'
import { productStatuOption, defaultSellerInfo, defaultProductForm } from '@/api/enum.js'
import { getSellerInfo } from '@/api/user.js'

export default {
  components: { PanThumb, Countdown },
  props: {
    pid: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      productForm: Object.assign({}, defaultProductForm),
      sellerInfo: Object.assign({}, defaultSellerInfo),
      bidAction: 'Wait',
      isFav: true,
      timecountdown: '2021-10-10'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'uid'
    ])
  },
  created() {
    this.fetchData(this.pid)
  },
  methods: {
    fetchData(passed_pid) {
      productDetail(passed_pid).then(response => {
        this.productForm = response.data
        this.ProcessData(this.pid)
        console.log(this.productForm.name)
      }).catch(err => {
        console.log(err)
      })
    },
    ProcessData(passed_pid) {
      // Handle Product Status
      if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['waiting']) {
        this.bidAction = 'Wait For Start'
        this.timecountdown = this.productForm.startTime
        console.log(this.timecountdown)
      } else if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['broughtIn']) {
        this.bidAction = 'Place Your Offer'
        console.log('placeoffer origin: ' + this.productForm.productStatus.endTime)
        this.timecountdown = this.productForm.productStatus.endTime
        console.log('placeoffer wrong: ' + this.timecountdown)
      } else {
        this.bidAction = 'End'
        this.timecountdown = '2011-01-01 00:00:00'
      }
      // Handle WishList
      this.isFav = false
      if (this.uid !== '') {
        console.log('start check fav:' + this.uid)
        checkInWishList(this.uid, passed_pid).then(response => {
          this.isFav = false
        }).catch(err => {
          this.isFav = true
          console.log(err)
        })
      }
      // TODO:Handle Seller Info
      getSellerInfo(this.productForm.uid).then(response => {
        this.sellerInfo = response.data
      })
    },
    AddToFav() {
      if (this.uid !== '') {
        if (this.isFav === false) {
          const request_data = { uid: this.uid, pid: this.pid }
          addToWishList(request_data).then(response => {
            this.isFav = true
          }).catch(err => {
            console.log(err)
          })
        } else {
          deleteFromWishList(this.uid, this.pid).then(response => {
            this.isFav = false
          }).catch(err => {
            console.log(err)
          })
        }
      } else {
        this.$message('Please login first!')
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
  min-height: 500px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    padding-top:35px;
    margin-top: 10px;
    height: 100px;
  }

  .description-item {
    margin-bottom: 10px;
    font-size: 14px;
    height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .start-item {
    position: relative;
    text-align: left;
        color: #aa3816c2;
    top: 0px;
    right: 0px;
    font-size: 16px;
    font-weight: bold;
  }

  .end-item {
    position: relative;
    text-align: left;
    color: #6cd62f;
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

  .price {
    position: absolute;
    text-align: right;
    color: #1ec9ba;
    top: 0px;
    right: 0px;
    font-size: 24px;
    font-weight: bold;
    padding-top: 2px;
  }

  .icon-button,
  .icon-button:hover,
  .icon-button:active,
  .icon-button:after
  {
    padding: 0px;
    margin: 10px;
    border: none;
    min-width: 6px;
    position: absolute;
    align-self: right;
    background: transparent;
  }
}
</style>
