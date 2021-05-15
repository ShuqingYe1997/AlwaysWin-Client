<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <div class="user-images">
        <el-carousel :interval="6000" type="card" height="400px">
          <el-carousel-item v-for="item in carouselImages" :key="item">
            <img :src="item+carouselPrefix" class="image">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="chart-wrapper">
        <div class="chart-wrapper">
          <!-- <h1>{{ product.name }}</h1> -->
          <h1>Product Name</h1>
          <!-- <h4 class="price">{{ product.price | dollar }}</h4> -->
          <h4 class="price">$100.00</h4>
          <!-- <p>{{ product.description }}</p> -->
          <p>Display: 6.7 inches Super Retina XDR OLED, Scratch-resistant ceramic glass, oleophobic coating - Resoultion: 1284 x 2778 pixels
            Memory: 256GB 6GB RAM
            Quad: 12 MP + 12 MP + 12 MP + TOF 3D LiDAR scanner w/ Dual-LED dual-tone flash, HDR (photo/panorama) -- Selfie Camera: Dual
            12MP + SL 3D, (depth/biometrics sensor)
            Platform: iOS 14.1 -- Apple A14 Bionic -- Hexa-core (2x3.1 GHz Firestorm + 4x1.8 GHz Icestorm) -- Apple GPU (4-core graphics)
            Battery: Li-Ion 3687 mAh, non-removable - Qi fast wireless charging 15W</p>
        </div>
        <div class="chart-wrapper">
          <div class="start-item">
            <Countdown deadline="2021/08/13" />
          </div>
        </div>
        <div class="chart-wrapper">
          <el-button style="width: 30%" type="primary" @click.prevent.stop="guide">
            Bid
          </el-button>
          <el-button class="svg-icon" style="background: star" />
        </div>
        <div class="chart-wrapper">
          <bid-list />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Countdown from 'vuejs-countdown'
import BidList from './BidList'

const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

export default {
  components: {
    Countdown,
    BidList
  },

  data() {
    return {
      id: this.$route.params.id,
      quantity: 1,
      size: null,
      showSizeRequiredMessage: false,
      carouselImages: [
        'https://wpimg.wallstcn.com/9679ffb0-9e0b-4451-9916-e21992218054.jpg',
        'https://wpimg.wallstcn.com/bcce3734-0837-4b9f-9261-351ef384f75a.jpg',
        'https://wpimg.wallstcn.com/d1d7b033-d75e-4cd6-ae39-fcd5f1c0a7c5.jpg',
        'https://wpimg.wallstcn.com/50530061-851b-4ca5-9dc5-2fead928a939.jpg',
        'https://ss7.vzw.com/is/image/VerizonWireless/iphone-12-pro-pacific-blue'
      ],
      avatarPrefix,
      carouselPrefix,
      tempcart: [] // this object should be the same as the json store object, with additional params, quantity and size
    }
  },
  computed: {
    ...mapState(['storedata']),
    product() {
      return this.storedata.find(el => el.id === this.id)
    }
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
    padding: 0px 10px 0;
    margin-bottom: 32px;
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
  padding: 5px 10px;
}

.update-num {
  background: black;
  border-color: black;
  color: white;
  font-size: 20px;
  width: 45px;
}

.size {
  margin-left: 10px;
}

.size-picker {
  width: 130px;
  font-size: 20px;
  height: 100%;
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
    width: 100%;
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
    text-align: left;
    color: #1ec9ba;
    top: 0px;
    right: 0px;
    font-size: 24px;
    font-weight: bold;
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

   .user-images {
      padding-top: 20px;
    }
</style>
