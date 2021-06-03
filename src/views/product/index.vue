<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20" style="margin-bottom: 50px;">

        <el-col :span="10" :xs="24">
          <el-carousel height="500px">
            <el-carousel-item
              v-for="item in productInfo.figures"
              :key="item.fid"
            >
              <el-image
                :src="item.url"
                :preview-src-list="figuresPreviewList"
                :alt="item.description"
                fit="contain"
                style="width: 100%; height: 100%;transition: all 0.2s linear;"
              >
                <div slot="error" class="image-slot"> <!--加载失败的话显示一个图标-->
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>

        <el-col :span="12" :xs="24">
          <div class="col-md-7 col-sm-7 col-xs-12">
            <div class="pl-6">
              <p class="display-1 mb-0">{{ productInfo.title }}</p>

              <p class="headline font-weight-bold pt-3">
                Current Price: ${{ productInfo.productStatus.price | toThousandFilter }}
              </p>

              <p class="headline font-weight-light pt-3">
                Start Price: ${{ productInfo.startPrice | toThousandFilter }}
              </p>

              <!--Counting down-->
              <div>
                <div
                  v-if="productInfo.productStatus.status === 'waiting'"
                  class="waiting-item"
                >
                  Time before starting
                  <Countdown :deadline="productInfo.startTime | formatDate1" />
                </div>
                <div
                  v-if="productInfo.productStatus.status === 'bidding'"
                  class="bidding-item"
                >
                  Time before ending
                  <Countdown :deadline="endTime | formatDate1" />
                </div>
                <div
                  v-if="productInfo.productStatus.status.includes('extended')"
                  class="extended-item"
                >
                  The deadline is approaching!
                  <Countdown :deadline="endTime | formatDate1" />
                </div>
                <div
                  v-if="productInfo.productStatus.status === 'success' || productInfo.productStatus.status === 'broughtIn'"
                  class="info-item"
                >
                  Auction has finished!
                </div>
                <div v-if="productInfo.productStatus.status === 'canceled'" class="info-item">
                  This product is canceled!
                </div>
              </div>

              <div class="chart-wrapper">
                <div>
                  <el-input
                    v-model="userOffer"
                    :disabled="productInfo.productStatus.status !== 'bidding' && !productInfo.productStatus.status.includes('extended')"
                    style="width: 300px; margin-right: 100px"
                    placeholder="Please input your target price"
                  />
                  <el-button
                    type="primary"
                    :disabled="productInfo.productStatus.status !== 'bidding' && !productInfo.productStatus.status.includes('extended')"
                    @click="placeOffer()"
                  >
                    Place Offer
                  </el-button>
                </div>
                <span class="min-offer-info"> Your offer should be at least ${{ minOffer | toThousandFilter }} </span>
              </div>

              <div style="padding-top: 20px">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="isFav ? 'Remove from wishlist' : 'Add to wishlist'"
                  placement="bottom"
                >
                  <el-button class="icon-button" @click="AddToFav()">
                    <i :class="isFav ? 'el-icon-star-on' : 'el-icon-star-off'" />
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Share"
                  placement="bottom"
                >
                  <el-button class="icon-button">
                    <i class="el-icon-share" />
                  </el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Report"
                  placement="bottom"
                >
                  <el-button class="icon-button">
                    <i class="el-icon-warning-outline" />
                  </el-button>
                </el-tooltip>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>

      <!--分割线-->
      <aside style="text-align: center;"><a>Show More</a></aside>

      <el-row class="anchor" :gutter="50" style="margin-bottom: 50px;">
        <el-col :span="10" :xs="24" style="margin-top: 50px;">
          <div class="row">
            <div class="col-sm-12 col-xs-12 col-md-12">
              <el-tabs v-model="activeTab" type="border-card">
                <el-tab-pane label="About this product" name="tab-description">
                  <DetailTable :product-info="productInfo" />
                </el-tab-pane>
                <el-tab-pane label="About the seller" name="tab-seller">
                  <SellerProfile :uid="productInfo.uid" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-col>

        <el-col :span="12" :xs="24">
          <!-- <BidList :list="productBidList" /> -->
          <BidList :product-bid-list="productBidList" />
        </el-col>

      </el-row>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Countdown from 'vuejs-countdown'
import BidList from './components/BidList'
import SellerProfile from './components/SellerProfile'
import DetailTable from './components/DetailTable'
import { timeFromNow } from '@/filters/index'
import { productDetail } from '@/api/product'
import { createBid, getBidsByPid } from '@/api/bid'
import { addToWishList, checkInWishList, deleteFromWishList } from '@/api/wishlist'

export default {
  name: 'ProductPage',
  components: {
    Countdown,
    BidList,
    SellerProfile,
    DetailTable
  },
  filters: {
    productTitleFilter(str) {
      const len = 400
      if (str.length > len) {
        return str.substring(0, len) + '...'
      } else return str
    }
  },

  data() {
    return {
      pid: 0,
      productInfo: {},
      sellerInfo: {},
      isFav: false,
      minOffer: 0,
      endTime: '',
      userOffer: undefined,
      productBidList: [],
      figuresPreviewList: [],
      activeTab: 'tab-description',
      bidlistQuery: {
        page: 1,
        pageSize: 5
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  created() {
    this.pid = this.$route.params.pid
    this.fetchData()
  },
  methods: {
    fetchData() {
      productDetail(this.pid)
        .then((response) => {
          this.productInfo = Object.assign({}, response.data)
          // this.productInfo = response.data
          this.minOffer = this.productInfo.productStatus.price + this.productInfo.minIncrement
          this.endTime = this.productInfo.productStatus.endTime

          for (const figure of this.productInfo.figures) {
            this.figuresPreviewList.push(figure.url)
          }

          setTimeout(() => {}, 200)
        })

      getBidsByPid(this.pid, this.bidlistQuery).then((response) => {
        this.productBidList = response.data
      })

      if (this.uid !== 0) {
        checkInWishList(this.uid, this.pid)
          .then((response) => {
            this.isFav = response.data === 1
          })
      }
    },

    getBidList() {
      getBidsByPid(this.pid, this.bidlistQuery).then((response) => {
        this.productBidList = response.data
      })
    },

    AddToFav() {
      if (this.uid !== 0) {
        if (this.isFav === false) {
          const request_data = { uid: this.uid, pid: this.pid }
          addToWishList(request_data)
            .then((response) => {
              this.isFav = true
              this.$message({ message: 'Added to wish list', type: 'success' })
            })
        } else {
          deleteFromWishList(this.uid, this.pid)
            .then((response) => {
              this.isFav = false
              this.$message({ message: 'Removed from wish list', type: 'success' })
            })
        }
      } else {
        this.$message({
          message: 'Please login first!',
          type: 'warning'
        })
      }
    },

    getTimeFromNow(timestamp) {
      return timeFromNow(timestamp)
    },

    placeOffer() {
      if (this.uid === 0) {
        this.$message({
          message: 'Please login first!',
          type: 'warning'
        })
        return
      }

      if (this.userOffer < this.minOffer) {
        this.$message(this.$message.error('You need to offer a higher price!'))
      } else {
        const offerData = {
          uid: this.uid,
          pid: this.pid,
          offer: this.userOffer
        }
        createBid(offerData).then((Response) => {
          // POP UP SUCCESS
          this.$message({
            message: 'Congratulations! Bid Placed!',
            type: 'success'
          })
          this.fetchData()
        })
          .catch((err) => {
            console.log('create failed:' + err + ' code=' + Response.code)
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

div.v-window__next {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  position: absolute;
  margin: 0 16px;
  left: 100% !important;
  top: calc(50% - 100px) !important;
  z-index: 1;
}
.display-2 {
  font-weight: 400;
  font-family: sans-serif !important;
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
  font-weight: 400;
  letter-spacing: normal !important;
}
.headline,
.title {
  padding: 12px 0px 0px !important;
  line-height: 2rem;
  font-family: sans-serif !important;
}
.title {
  font-size: 1.25rem !important;
  font-weight: 500;
  letter-spacing: 0.0125em !important;
}
.font-weight-light {
  // font-weight: 300 !important;
  font-size: 16px;
}
.font-weight-bold {
  font-weight: bold;
  font-size: 20px;
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
  padding-top: 6px !important;
}
.subtitle-1 {
  font-size: 1rem !important;
  font-weight: 400;
  letter-spacing: 0.009375em !important;
  line-height: 1.75rem;
  font-family: sans-serif !important;
}
.font-weight-thin {
  font-weight: 100 !important;
}
.min-offer-info {
  font-size: 14px;
  text-align: left;
  color: #99A9BF;
  margin-top: 20px;
  bottom: 0px;
}
.waiting-item {
    position: relative;
    text-align: left;
    color: #42b983;
    top: 0px;
    font-size: 16px;
  }

  .bidding-item {
    position: relative;
    text-align: left;
    color: #F7BA2A;
    top: 0px;
    font-size: 16px;
  }

  .extended-item {
    position: relative;
    text-align: left;
    color: #C03639;
    top: 0px;
    font-size: 16px;
}
  .info-item {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
    color: #616b7a;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
