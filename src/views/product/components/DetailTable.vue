<template>
  <div class="chart-wrapper">
    <div class="container">
      <table>
        <thead>
          <th colspan="2">Product Info</th>
        </thead>
        <tbody>
          <tr>
            <td style="width: 45%">Catalog</td>
            <td>
              <el-tag type="info">
                {{ productCate[productInfo.cate1].text }}
              </el-tag>
            </td>
          </tr>
          <tr>
            <td>Start Price:</td>
            <td>${{ productInfo.startPrice }}</td>
          </tr>
          <tr>
            <td>Auto Win Price:</td>
            <td>${{ productInfo.autoWinPrice }}</td>
          </tr>
          <tr>
            <td>Minimum Increment Price:</td>
            <td>${{ productInfo.minIncrement }}</td>
          </tr>
          <tr v-if="!readMoreInfo">
            <td
              colspan="2"
              style="
                text-align: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                line-height: 12px;
              "
            >
              <a class="readmore" @click="activateMoreInfo"> READ MORE </a>
            </td>
          </tr>
          <tr v-if="readMoreInfo">
            <td>Create Time:</td>
            <td>{{ productInfo.createTime | formatDate }}</td>
          </tr>
          <tr v-if="readMoreInfo">
            <td>Start Time:</td>
            <td>{{ productInfo.startTime | formatDate }}</td>
          </tr>
          <tr v-if="readMoreInfo">
            <td>End Time:</td>
            <td>{{ productInfo.endTime | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <table style="line-height: 24px">
      <thead>
        <th>Description</th>
      </thead>
      <tbody>
        <tr>
          <td v-if="!readMoreDesc" style="width: 100%">
            {{ productInfo.description.slice(0, 200) }}
          </td>
          <td v-if="readMoreDesc" style="width: 100%">
            {{ productInfo.description }}
          </td>
        </tr>
        <tr v-if="!readMoreDesc && productInfo.description.length > 199">
          <td
            colspan="2"
            style="
              text-align: center;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              line-height: 12px;
            "
          >
            <a class="readmore" @click="activateMoreDesc"> READ MORE </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getProductCate } from '@/api/product'

export default {
  props: {
    productInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      readMoreDesc: false,
      readMoreInfo: false,
      productCate: getProductCate()
    }
  },
  methods: {
    activateMoreDesc() {
      this.readMoreDesc = true
    },
    activateMoreInfo() {
      this.readMoreInfo = true
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  padding: 0px 10px 0;
  margin-bottom: 20px;
}

.container {
  margin-bottom: 32px;
  border: gray 1px;
  background: linear-gradient(45deg, #ffffff, #ffffff);
}

table {
  width: 100%;
  border-collapse: collapse;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

th,
td {
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  color: rgb(0, 0, 0);
}

th {
  text-align: left;
  color: rgb(0, 0, 0);
}

tbody {
  td {
    position: relative;
    &:hover {
      &:before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: -9999px;
        bottom: -9999px;
        background-color: rgba(255, 255, 255, 0.2);
        z-index: -1;
      }
    }
  }
}

.des-text {
  font-size: 16px;
}

.readmoreCol {
}

.readmore {
  color: #4d5b9b;
}
</style>
