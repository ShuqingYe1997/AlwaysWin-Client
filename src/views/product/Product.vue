<template>
  <div>
    <v-container>
      <div class="row">
        <div class="col-md-5 col-sm-5 col-xs-12">
          <v-carousel>
            <v-carousel-item
              v-for="item in productForm.figures"
              :key="item.pid"
              :src="item.url"
            />
          </v-carousel>
        </div>
        <div class="col-md-7 col-sm-7 col-xs-12">
          <v-breadcrumbs class="pb-0" />
          <div class="pl-6">
            <p class="display-1 mb-0">{{ productForm.title }}</p>
            <v-card-actions v-model="productForm.productStatus.price" class="pa-0">
              <p class="headline font-weight-light pt-3">
                ${{ productForm.productStatus.price }}
              </p>
              <v-spacer />
            </v-card-actions>
            <p
              v-if="productForm.description.length < 400"
              class="subtitle-1 font-weight-thin"
            >
              {{ productForm.description }}
            </p>
            <p v-else class="subtitle-1 font-weight-thin">
              {{ productForm.description.substring(0, 400) + ".." }}
            </p>
            <div
              v-if="
                productForm.productStatus.status === 'bidding' ||
                productForm.productStatus.status.includes('extended')
              "
              class="end-item"
            >
              <p class="title">Time before ending</p>
              <Countdown
                :deadline="productForm.productStatus.endTime | formatDate1"
              />
            </div>
            <div
              v-else-if="productForm.productStatus.status === 'waiting'"
              class="start-item"
            >
              <p class="title">Time before starting</p>
              <Countdown :deadline="productForm.startTime | formatDate1" />
            </div>
            <div
              v-else-if="
                productForm.productStatus.status === 'success' ||
                productForm.productStatus.status === 'broughtIn'
              "
              class="warning-item"
            >
              Auction has finished!
            </div>
            <div
              v-else-if="productForm.productStatus.status === 'canceled'"
              class="warning-item"
            >
              This product is canceled!
            </div>
            <div class="chart-wrapper">
              <v-text-field
                v-model="user_offer"
                :disabled="productForm.productStatus.status !== 'bidding'"
                outlined
                style="width: 100px"
                :value="user_offer"
                type="Number"
                dense
              />
            </div>
            <v-btn
              class="primary white--text"
              outlined
              tile
              dense
              :disabled="productForm.productStatus.status !== 'bidding'"
              @click="placeOffer()"
              >Place Offer</v-btn
            >
            <!-- <v-btn class="ml-4" outlined tile>ADD TO WISHLIST</v-btn> -->
            <el-button class="icon-button" @click="AddToFav()">
              <i :class="isFav ? 'el-icon-star-on' : 'el-icon-star-off'" />
            </el-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-xs-12 col-md-12">
          <v-tabs>
            <v-tab>Description</v-tab>
            <v-tab>Bid List</v-tab>
            <v-tab-item>
              <p class="pt-10 subtitle-1 font-weight-thin">
                {{ productForm.description }}
              </p>
            </v-tab-item>
            <v-tab-item>
              <bid-list v-model="this.productBidList" :pid="this.pid" :productBidList="productBidList" />
            </v-tab-item>
          </v-tabs>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Countdown from 'vuejs-countdown'
// import PanThumb from '@/components/PanThumb'
import BidList from './BidList'
import { productDetail } from '@/api/product.js'
import { createBid, getBidsByPidByPages } from '@/api/bid.js'
import { timeFromNow } from '@/filters/index'

import { addToWishList, checkInWishList, deleteFromWishList } from '@/api/wishlist.js'
import {
  productStatuOption,
  defaultSellerInfo,
  defaultProductForm
} from '@/api/enum.js'
import { getSellerInfo } from '@/api/user.js'

export default {
  components: {
    // PanThumb,
    Countdown,
    BidList
  },

  data() {
    return {
      pid: this.$route.params.id,
      productForm: Object.assign({}, defaultProductForm),
      sellerInfo: Object.assign({}, defaultSellerInfo),
      bidAction: 'Wait',
      isFav: false,
      timecountdown: '2021-12-12',
      user_offer: 0,
      productBidList: []
    }
  },
  computed: {
    ...mapGetters(['roles', 'uid'])
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
      productDetail(passed_pid)
        .then((response) => {
          this.productForm = response.data
          this.ProcessData(this.pid)
          this.user_offer =
            this.productForm.productStatus.price +
            this.productForm.minIncrement
          console.log(this.productForm.name)
        })
        .catch((err) => {
          console.log(err)
        })

      getBidsByPidByPages(passed_pid, 1, 5)
        .then((response) => {
          this.productBidList = response.data
          console.log(productBidList)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    ProcessData(passed_pid) {
      // Handle Product Status
      if (
        productStatuOption[this.productForm.status] <=
        productStatuOption['waiting']
      ) {
        this.bidAction = 'Wait For Start'
        this.timecountdown = this.productForm.startTime
          .replace(/T/, ' ')
          .replace(/\..+/, '')
        console.log(this.timecountdown)
      } else if (
        productStatuOption[this.productForm.status] <=
        productStatuOption['broughtIn']
      ) {
        this.bidAction = 'Place Your Offer'
        console.log('placeoffer origin: ' + this.productForm.endTime)
        this.timecountdown = this.productForm.endTime
          .replace(/T/, ' ')
          .replace(/\..+/, '')
        console.log('placeoffer wrong: ' + this.timecountdown)
      } else {
        this.bidAction = 'End'
        this.timecountdown = '2011-01-01 00:00:00'
      }
      // Handle WishList
      this.isFav = false
      if (this.uid !== '') {
        console.log('start check fav:' + this.uid)
        checkInWishList(this.uid, passed_pid)
          .then((response) => {
            this.isFav = false
          })
          .catch((err) => {
            this.isFav = true
            console.log(err)
          })
      }
      // TODO:Handle Seller Info
      getSellerInfo(this.productForm.uid).then((response) => {
        this.sellerInfo = response.data
      })
    },
    AddToFav() {
      if (this.uid !== '') {
        if (this.isFav === false) {
          const request_data = { uid: this.uid, pid: this.pid }
          addToWishList(request_data)
            .then((response) => {
              this.isFav = true
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          deleteFromWishList(this.uid, this.pid)
            .then((response) => {
              this.isFav = false
            })
            .catch((err) => {
              console.log(err)
            })
        }
      } else {
        this.$message('Please login first!')
      }
    },
    getTimeFromNow(timestamp) {
      return timeFromNow(timestamp)
    },
    placeOffer() {
      if(this.uid == '')
      {

        this.$message('Please login first!')
        return
      }

      if (
        this.user_offer <
        this.productForm.productStatus.price + this.productForm.minIncrement
      ) {
        // popup error
        this.$message('Bid failed!')
      } else {
        const offerData = {
          uid: this.uid,
          pid: this.pid,
          offer: this.user_offer
        }
        createBid(offerData).then((Response) => {
            // POP UP SUCCESS
            this.$message('Bid Placed!')
            this.fetchData(this.pid)
          })
          .catch((err) => {
            console.log("create failed:" + err + " code=" + Response.code)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  padding: 20px 0px 0px;
}

.icon-button,
.icon-button:hover,
.icon-button:active,
.icon-button:after {
  align-self: center;
  top: 5px;
  padding: 10px;
  border: none;
  font-size: 25px; // 设置按钮大小
  min-width: 20px;
  position: relative;
  background: transparent;
}

.start-item {
  position: relative;
  text-align: left;
  color: #616b7a;
  top: 0px;
  font-size: 16px;
}

.end-item {
  position: relative;
  align-self: left;
  color: #42b983;
  top: 0px;
  font-size: 16px;
}
.warning-item {
  font-size: 20px;
  font-weight: bold;
  align-self: left;
  color: #f7ba2a;
  margin-top: 30px;
  margin-bottom: 20px;
}
div.v-window__next {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  position: absolute;
  margin: 0 16px;
  left: 100% !important;
  top: calc(50% - 100px) !important;
  z-index: 1;
}
.display-1,
.display-2 {
  font-weight: 400;
  font-family: Roboto, sans-serif !important;
}
.display-1 {
  font-size: 2.125rem !important;
  line-height: 2.5rem;
  letter-spacing: 0.0073529412em !important;
}
.mb-0 {
  margin-bottom: 0 !important;
}
.pb-0 {
  padding-bottom: 0 !important;
}
.headline {
  font-size: 1.5rem !important;
  font-weight: 400;
  letter-spacing: normal !important;
}
.headline,
.title {
  padding: 12px 0px 0px !important;
  line-height: 2rem;
  font-family: Roboto, sans-serif !important;
}
.title {
  font-size: 1.25rem !important;
  font-weight: 500;
  letter-spacing: 0.0125em !important;
}
.font-weight-light {
  font-weight: 300 !important;
}
.pt-10 {
  padding-top: 40px !important;
}
.pl-6 {
  padding-left: 24px !important;
}
.pa-0 {
  padding: 0 !important;
}
.pt-3 {
  padding-top: 12px !important;
}
.subtitle-1 {
  font-size: 1rem !important;
  font-weight: 400;
  letter-spacing: 0.009375em !important;
  line-height: 1.75rem;
  font-family: Roboto, sans-serif !important;
}
.font-weight-thin {
  font-weight: 100 !important;
}
</style>
