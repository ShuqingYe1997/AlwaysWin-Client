<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="500px">
          <el-carousel-item v-for="item in this.productForm.figures" :key="item">
            <img :src="item.url" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <el-row :gutter="8">
        <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
          <div class="user-header">
            <pan-thumb :image="sellerInfo.portrait" class="panThumb" />
            <p class="username"> {{ sellerInfo.username }}</p>
          </div>
          <div class="chart-wrapper">
            <h1>{{ productForm.title }}</h1>
            <p>{{ productForm.description }}</p>
          </div>
        </el-col>
        <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
          <div v-if="bidAction === 'Place Your Offer'" class="end-item">
            <Countdown :deadline="this.timecountdown" />
            <p class="price"> ${{ productForm.productStatus.price }}</p>
          </div>
          <div v-else class="start-item">
            <Countdown :deadline="this.timecountdown" />
            <p class="price"> ${{ productForm.productStatus.price }}</p>
          </div>
          <div style="margin-bottom: 32px;">
            <el-button v-if="bidAction === 'Place Your Offer'" style="width: 95%" type="primary" @click.prevent.stop="guide">
              {{ bidAction }}
            </el-button>
            <el-button v-else style="width: 95%" type="info" disabled>
              {{ bidAction }}
            </el-button>
            <el-button class="icon-button" @click="AddToFav()">
              <i :class="isFav? 'el-icon-star-on' : 'el-icon-star-off'" />
            </el-button>
          </div>
          <div>
            <bid-list />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Countdown from 'vuejs-countdown'
import PanThumb from '@/components/PanThumb'
import BidList from './BidList'
import { productDetail } from '@/api/product.js'
import { addToWishList, checkInWishList, deleteFromWishList } from '@/api/wishlist.js'
import { productStatuOption, defaultSellerInfo, defaultProductForm } from '@/api/enum.js'
import { getSellerInfo } from '@/api/user.js'

export default {
  name: 'ProductPage',
  components: {
    PanThumb,
    Countdown,
    BidList
  },

  data() {
    return {
      pid: this.$route.params.id,
      productForm: Object.assign({}, defaultProductForm),
      sellerInfo: Object.assign({}, defaultSellerInfo),
      bidAction: 'Wait',
      isFav: true,
      timecountdown: '2021-12-12'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'uid'
    ])
  },
  created() {
    this.pid = this.$route.params.id
    console.log('pid' + this.pid)
    this.fetchData(this.pid)
  },
  methods: {
    cartAdd() {
      if (this.product.sizes && !this.size) {
        this.showSizeRequiredMessage = true
        return
      }

      let item = this.product
      item = {
        ...item,
        quantity: this.quantity,
        size: this.size
      }
      this.tempcart.push(item)
      this.$store.commit('addToCart', { ...item })
    },
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
        this.timecountdown = this.productForm.startTime.replace(/T/, ' ').replace(/\..+/, '')
        console.log(this.timecountdown)
      } else if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['broughtIn']) {
        this.bidAction = 'Place Your Offer'
        console.log('placeoffer origin: ' + this.productForm.endTime)
        this.timecountdown = this.productForm.endTime.replace(/T/, ' ').replace(/\..+/, '')
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
        console.log('Please Login firist.')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    padding: 0px 12px 0;
    margin-bottom: 32px;
  }

  .user-header{
    padding: 0px 12px 0;
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
  }
}

.item-contain {
  margin-left: 8%;
  width: 80%;
  display: grid;
  justify-content: space-around;
  grid-template-columns: 1fr 2fr;
}

.product-options {
  display: flex;
}

input,
select {
  width: 60px;
  font-size: 25px;
  margin: 0 5px;
  padding: 5px 12px;
}

.update-num {
  background: black;
  border-color: black;
  color: white;
  font-size: 20px;
  width: 45px;
}

.size {
  margin-left: 12px;
}

.size-picker {
  width: 130px;
  font-size: 20px;
  height: 120%;
  border: 0;
  background-color: white;
  outline: 1px solid #ccc;
  outline-offset: -1px;
}

.quantity {
  display: flex;
}

.size-required-message {
  color: red;
}

@media screen and (max-width: 650px) {
  .img img {
    width: 120%;
  }

  .item-contain {
    margin-left: 0 !important;
    width: 95% !important;
  }

  .review {
    width: 90%;
    margin-left: 4%;
  }
}

 .price {
    position: relative;
    float: right;
    color: #1ec9ba;
    font-size: 24px;
    font-weight: bold;
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
    display: flex;
    justify-content: space-between;
    position: relative;
    text-align: left;
    color: #6cd62f;
    top: 0px;
    right: 0px;
    font-size: 16px;
    font-weight: bold;
  }

   .user-images {
      padding-top: 20px;
    }

  .icon-button,
  .icon-button:hover,
  .icon-button:active,
  .icon-button:after
  {
    padding: 0px;
    margin: 12px;
    border: none;
    min-width: 6px;
    position: absolute;
    align-self: right;
    background: transparent;
  }

  .panThumb {
    z-index: 120;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -20px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
}

.username {
  float: left;
  position: relative;
  color: #000000;
  padding: 0px 70px 0px;
  font-size: 16px;
}

    .image {
      width: 100%;
      height: 100%;

    }
</style>
