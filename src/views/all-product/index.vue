<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="cateSearch"
        placeholder="Category"
        clearable
        class="filter-item"
        style="width: 250px;margin-right: 20px"
      >
        <el-option
          v-for="item in Object.keys(productCate)"
          :key="productCate[item].value"
          :label="productCate[item].text"
          :value="productCate[item].value"
        />
      </el-select>

      <el-select
        v-model="orderSearch"
        clearable
        style="width: 300px;margin-right: 20px"
        class="filter-item"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        Search
      </el-button>
    </div>

    <div>
      <el-row :gutter="8">
        <el-col v-for="item in productList" :key="item.pid" :xs="{span: 6}" :sm="{span: 6}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
          <ProductCard :product="item" :uid="uid" />
        </el-col>
      </el-row>

      <pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { overview, searchProduct, getProductCate } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AllProduct',
  components: {
    ProductCard,
    Pagination
  },
  directives: { waves },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 20 // 4的倍数
      },
      total: 0,
      productList: [],
      keyword: undefined,
      cateSearch: '',
      orderSearch: '',
      sortOptions: [
        { label: 'Price ascending', key: '+price' },
        { label: 'Price descending', key: '-price' },
        { label: 'Autowin price ascending', key: '+autowinprice' },
        { label: 'Autowin price descending', key: '-autowinprice' }
      ],
      productCate: getProductCate()
    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  // watch: {
  //   user: function() {
  //     this.endVal = this.user.balance
  //   }
  // },
  created() {
    // 是搜索结果
    if (this.$route.query) {
      this.keyword = this.$route.query.keyword
    }
    console.log('keyword: ' + this.keyword)
    this.getList()
  },

  methods: {
    getList() {
      if (this.keyword === undefined) {
        // 不是搜索是展示
        overview(this.listQuery).then((response) => {
          this.productList = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {}, 200)
        })
      } else {
        // 是搜索
        var temp = Object.assign({}, this.listQuery)
        temp.keyword = this.keyword
        searchProduct(temp).then((response) => {
          this.productList = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {}, 200)
        })
      }
    },

    handleSearch() {
      var temp = Object.assign({}, this.listQuery)
      temp.page = 1
      if (this.cateSearch !== '') {
        temp.cate = this.cateSearch
      }
      if (this.orderSearch !== '') {
        switch (this.orderSearch) {
          case '+price':
            temp.sortedBy = 'price'
            temp.ordering = 'asc'
            break
          case '-price':
            temp.sortedBy = 'price'
            temp.ordering = 'desc'
            break
          case '+autowinprice':
            temp.sortedBy = 'auto_win_price'
            temp.ordering = 'asc'
            break
          case '-autowinprice':
            temp.sortedBy = 'auto_win_price'
            temp.ordering = 'desc'
            break
        }
      }
      overview(temp).then((response) => {
        this.productList = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {}, 200)
      })
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
