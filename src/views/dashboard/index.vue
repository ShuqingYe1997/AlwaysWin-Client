<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
      <el-drag-select v-model="value" style="width:100%;" multiple placeholder="Catalog" @change="getList()">
        <el-option v-for="item in productCat" :key="item.value" :label="item.label" :value="item.value" />
      </el-drag-select>
    </div>
    <el-row :gutter="8">
      <el-col v-for="item in productList" :key="item.pid" :xs="{span: 6}" :sm="{span: 6}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
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
import { overview } from '@/api/product.js'

export default {
  name: 'Dashboard',
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
        total: 10,
        page: 1,
        limit: 10
      },
      productList: [],
      productCat,
      value: []
    }
  },
  created() {
    this.listQuery = {
      total: 10,
      page: 1,
      limit: 10
    }
    this.getList()
  },
  methods: {
    updateMessage: async function() {
      this.getList()
    },
    getList() {
      if (this.value.length === 0) {
        overview(1, this.listQuery.limit).then(response => {
          this.listQuery.page = 1
          this.productList = response.data.list
          this.listQuery.total = response.data.total
        })
      }
    },
    updatePage() {
      if (this.value.length === 0) {
        overview(this.listQuery.page, this.listQuery.limit).then(response => {
          this.productList = response.data.list
          this.listQuery.total = response.data.total
        })
      }
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
