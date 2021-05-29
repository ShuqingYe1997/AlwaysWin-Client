<template>
  <div>
    <el-row>
      <el-col :span="6" :xs="24">
        <div class="component-item" style="height: auto;">
          <dropdown-menu :items="productCate" style="margin:0 auto;" title="Category" />
        </div>
      </el-col>

      <el-col :span="18" :xs="24">
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="item in figures" :key="item.fid">
            <router-link :to="'/product/' + item.pid">
              <el-image :src="item.url" fit="contain" style="width: 100%; height: 100%;transition: all 0.2s linear;">
                <div slot="error" class="image-slot"> <!--加载失败的话显示一个图标-->
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </router-link>
          </el-carousel-item>
        </el-carousel>
      </el-col>

    </el-row>
  </div>
</template>

<script>

import Mallki from './mixins/Mallki'
import DropdownMenu from './mixins/DropdownMenu'

export default {
  name: 'Billboard',
  components: {
    DropdownMenu,
    Mallki
  },
  data() {
    return {
      productCate: [{
        value: 'cell phone',
        label: 'Mobile Phones'
      }, {
        value: 'tablet',
        label: 'Tablets'
      }, {
        value: 'portable audio',
        label: 'Portable Audio'
      }, {
        value: 'camera',
        label: 'Camera'
      }, {
        value: 'accessory',
        label: 'Accessory'
      }, {
        value: 'computer',
        label: 'Computer'
      }, {
        value: 'car electronics',
        label: 'Car Electronics'
      }, {
        value: 'gaming console',
        label: 'Game Console'
      }, {
        value: 'Show More',
        label: 'Show More...'
      }],
      figures: [{
        fid: 130,
        pid: 94,
        url: 'https://alwayswin-figures.s3.amazonaws.com/product-figure/ipad2020.jpg'
      },
      {
        fid: 3,
        pid: 3,
        url: 'https://alwayswin-figures.s3.amazonaws.com/product-figure/iphxr-bl.png'
      },
      {
        fid: 6,
        pid: 6,
        url: 'https://alwayswin-figures.s3.amazonaws.com/product-figure/s-l502.jpg'
      },
      {
        fid: 9,
        pid: 9,
        url: 'https://alwayswin-figures.s3.amazonaws.com/product-figure/Bolt+Drone.jpg'
      }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
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
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>
