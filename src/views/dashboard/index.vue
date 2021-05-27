<template>
  <div class="dashboard-editor-container">

    <!--没有冒号！！！-->
    <div v-if="uid !== 0">
      <PanelGroup :uid="uid" />
    </div>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="hottest-text">Recommend for you</div>
      <Billboard />
    </el-row>

    <el-row :gutter="8" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div class="hottest-text">Hottest</div>
      <el-col v-for="item in productList" :key="item.pid" :xs="{span: 6}" :sm="{span: 6}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <ProductCard :uid="uid" :product="item" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PanelGroup from './components/PanelGroup'
import Billboard from './components/Billboard'
import ProductCard from '@/views/all-product/components/ProductCard'
import { overview, getProductCate } from '@/api/product'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    Billboard,
    ProductCard
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 8
      },
      showPanel: false,
      productList: [],
      productCate: getProductCate()
    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  watch: {
    showPanel: function() {
      return this.uid !== 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      overview(this.listQuery).then(response => {
        this.productList = response.data.list
        this.listQuery.total = response.data.total
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
.hottest-text {
  font-weight: bold;
  color: rgba(0, 0, 0, 0.45);
  font-size: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
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
