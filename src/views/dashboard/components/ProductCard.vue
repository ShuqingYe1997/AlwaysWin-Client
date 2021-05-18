<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <router-link :to="`/product/${productForm.pid}`">
      <div>
        <div slot="header" class="box-card-header">
          <img :src="`${productForm.thumbnail.thumbnail}`">
        </div>
        <div style="position:relative;">
          <pan-thumb :image="sellerInfo.portrait" class="panThumb" />
          <span class="price"> ${{ productForm.productStatus.price }} </span>
          <div style="padding-top:35px;" class="title-item">
            <span> {{ pid }}{{ productForm.title }}</span>
          </div>
          <div class="description-item">
            <span>{{ productForm.description }} </span>
          </div>
          <div v-if="bidAction === 'Place An Offer'" class="end-item">
            <Countdown :deadline="timecountdown" />
          </div>
          <div v-else class="start-item">
            <Countdown :deadline="timecountdown" />
          </div>
        </div>
      </div>
    </router-link>
    <div style="position:relative;">
      <el-button v-if="bidAction === 'Place An Offer'" style="width: 90%" type="primary" @click.prevent.stop="guide">
        {{ bidAction }}
      </el-button>
      <el-button v-else style="width: 90%" type="info" disabled>
        {{ bidAction }}
      </el-button>
      <el-button v-if="isFav" class="icon-button" @click="RemoveFromFav()">
        <i class="el-icon-star-on" />
      </el-button>
      <el-button v-else class="icon-button" @click="AddToFav()">
        <i class="el-icon-star-off" />
      </el-button>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Countdown from 'vuejs-countdown'
import { productDetail } from '@/api/product.js'
import { addToWishList, checkInWishList } from '@/api/wishlist.js'
import { productStatuOption } from '@/api/enum.js'

const defaultProductForm = {
  pid: 8,
  uid: 1,
  title: 'Iphone 10 Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10Iphone 10',
  description: 'test txt a lot of text test txt a lot of text test txt a lot of texttest txt a lot of texttest txt a lot of texttest txt a lot of texttest txt a lot of texttest txt a lot of text',
  cate1: '',
  cate2: '',
  cate3: '',
  createTime: '',
  startTime: '',
  endTime: '',
  startPrice: 0.0,
  autoWinPrice: 0.0,
  reservedPrice: 0.0,
  minIncrement: 1.0,
  productStatus: {
    psid: 8,
    pid: 8,
    price: 0.0,
    status: '',
    endTime: ''
  },
  figures: [
    {
      fid: 8,
      pid: 8,
      url: '',
      description: '',
      updatedTime: '',
      thumbnail: true
    }
  ],
  thumbnail: {
    fid: 8,
    pid: 8,
    url: '',
    description: '',
    updatedTime: '',
    thumbnail: true
  },
  canceled: false,
  passed: true
}

const defaultSellerInfo =
{
  uid: undefined,
  name: 'TestName',
  portrait: 'https://ss7.vzw.com/is/image/VerizonWireless/iphone-12-pro-pacific-blue'
}

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
      timecountdown: new Date()
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
    this.ProcessData(this.pid)
  },
  methods: {
    fetchData(passed_pid) {
      productDetail(passed_pid).then(response => {
        this.productForm = response.data
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
      } else if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['broughtIn']) {
        this.bidAction = 'Place An Offer'
        this.timecountdown = this.productForm.endTime
      } else {
        this.bidAction = 'End'
        this.timecountdown = new Date()
      }
      // Handle WishList
      this.isFav = false
      if (this.uid !== '') {
        checkInWishList(this.uid, passed_pid).then(response => {
          this.isFav = response.data == null
        }).catch(err => {
          console.log(err)
        })
      }
      // TODO:Handle Seller Info
    },
    AddToFav() {
      if (this.uid !== '') {
        const request_data = '{"uid": ' + this.uid + ',"pid": ' + this.pid + '}'
        addToWishList(request_data).then(response => {
        }).catch(err => {
          console.log(err)
        })
      } else {
        // TODO: pop out error or request login
      }
    },
    RemoveFromFav() {
      if (this.uid !== '') {
        addToWishList(this.uid, this.pid).then(response => {
        }).catch(err => {
          console.log(err)
        })
      } else {
        // TODO: pop out error or request login
      }
    }
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
  min-width: 24px;
  margin-right: 32px ;
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
        color: #b6350ec2;
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
