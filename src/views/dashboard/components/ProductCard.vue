<template>
  <router-link :to="`/${productForm.pid}`">
    <el-card class="box-card-component" style="margin-left:8px;">
      <div slot="header" class="box-card-header">
        <img :src="`${productForm.thumbnail.thumbnail}`">
      </div>
      <div style="position:relative;">
        <pan-thumb :image="sellerInfo.portrait" class="panThumb" />
        <span class="price"> ${{ productForm.productStatus.price }} </span>
        <div style="padding-top:35px;" class="title-item">
          <span> {{ productForm.title }}</span>
        </div>
        <div class="description-item">
          <span>{{ productForm.description }} </span>
        </div>
        <div class="start-item">
          <Countdown deadline="2021/08/13" />
        </div>
        <div>
          <el-button v-if="bidAction === 'Place An Offer'" style="width: 90%" type="primary" @click.prevent.stop="guide">
            {{ bidAction }}
          </el-button>
          <el-button v-else style="width: 90%" type="info" disabled>
            {{ bidAction }}
          </el-button>
          <i v-if="isFav" class="el-icon-star-on" />
          <i v-else class="el-icon-star-off" />
        </div>
      </div>
    </el-card>
  </router-link>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import Countdown from 'vuejs-countdown'
import { productDetail } from '@/api/product.js'
import { productStatuOption } from '@/api/enum.js'

const defaultProductForm = {
  pid: 8,
  uid: 1,
  title: '',
  description: '',
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

  data() {
    return {
      productForm: Object.assign({}, defaultProductForm),
      sellerInfo: Object.assign({}, defaultSellerInfo),
      bidAction: 'Wait',
      isFav: true
    }
  },
  created() {
    const pid = 2
    this.fetchData(pid)
    this.ProcessData()
  },
  methods: {
    fetchData(pid) {
      productDetail(pid).then(response => {
        this.productForm = response.data
        console.log(this.productForm.name)
      }).catch(err => {
        console.log(err)
      })
    },
    ProcessData() {
      if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['waiting']) {
        this.bidAction = 'Wait For Start'
      } else if (productStatuOption[this.productForm.productStatus.status] <= productStatuOption['broughtIn']) {
        this.bidAction = 'Place An Offer'
      } else {
        this.bidAction = 'End'
      }
      this.isFav = true /* checkDuplicate(uid, pid);*/
    },
    AddToFav() {},
    RemoveFromFav() {
    }
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
