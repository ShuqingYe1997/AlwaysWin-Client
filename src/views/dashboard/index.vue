<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <el-drag-select v-model="value" style="width:100%;" multiple placeholder="Catalog" @change="getList">
        <el-option v-for="item in productCat" :key="item.value" :label="item.label" :value="item.value" />
      </el-drag-select>
    </div>
    <el-row :gutter="8">
      <el-col v-for="item in displayList" :key="item.pid" :xs="{span: 6}" :sm="{span: 6}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <product-card :pid="item.pid" />
      </el-col>
    </el-row>
    <div class="chart-wrapper">
      <pagination :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="updatePage()" />
    </div>
  </div>
</template>

<script>
import ProductCard from './components/ProductCard'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { productCat } from '@/api/enum.js'
// import { overview } from '@/api/product.js'

const defaultProductList = [{
  'pid': 1,
  'uid': 1,
  'title': '1Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png'
}, {
  'pid': 2,
  'uid': 1,
  'title': '2Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png' }, {
  'pid': 6,
  'uid': 1,
  'title': '3Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png' }, {
  'pid': 3,
  'uid': 1,
  'title': '4Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png' }, {
  'pid': 4,
  'uid': 1,
  'title': '5Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png' }, {
  'pid': 5,
  'uid': 1,
  'title': '6Apple iPhone XR 64GB Factory Unlocked Smartphone 4G LTE iOS Smartphone',
  'cate1': 'cell phone',
  'endTime': '2021-06-15T23:59:59.000-07:00',
  'autoWinPrice': 599,
  'price': 599,
  'status': 'success',
  'url': 'https://alwayswin-figures.s3.amazonaws.com/product-figure/default-product-thumbnail.png' }
]

export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup,
    // LineChart,
    // RaddarChart,
    // PieChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard,
    ProductCard,
    ElDragSelect,
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 2, // TODO: For test only, remove it later
        total: 5
      },
      displayList: Object.assign({}, defaultProductList),
      productCat,
      value: []
    }
  },
  created() {
    this.productList = defaultProductList
    this.getList()
  },
  methods: {
    getList() {
    //   this.listLoading = true
      // overview().then(response => {
      this.listQuery.page = 1
      this.listQuery.total = this.productList.length
      this.displayList = this.productList.slice(0, this.listQuery.limit)
      // })
    },
    updatePage() {
      const startIndex = (this.listQuery.page - 1) * this.listQuery.limit
      this.displayList = this.productList.slice(startIndex, startIndex + this.listQuery.limit)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  padding-right: 32px;
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

.entry {
  flex: 1 0 25%;
}
</style>
