<template>
  <div class="app-container">
    <div class="filter-container">
      <el-switch
        v-model="modeView"
        active-text="See in process auctions"
        active-color="#13ce66"
        inactive-text="See all auctions"
        inactive-color="#1890FF"
      />
    </div>
    <div>
      <el-row :gutter="8">
        <el-col v-for="item in wishListData" :key="item.wid" :xs="{span: 6}" :sm="{span: 6}" :md="{span: 6}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
          <WishListCard :wish-list-item="item" :uid="uid" />
        </el-col>
      </el-row>

      <pagination :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { myWishList } from '@/api/wishlist'
import WishListCard from './components/WishListCard'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'Wishlist',
  components: {
    WishListCard,
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 12 // 4的倍数
      },
      wishList: [],
      modeView: false

    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ]),
    wishListData: function() {
      if (this.modeView) {
        return this.wishList
          .filter(data => data.productPreview.status === 'bidding' || data.productPreview.status.includes('extended'))
          .slice((this.listQuery.page - 1) * this.listQuery.pageSize, this.listQuery.page * this.listQuery.pageSize)
      } else return this.wishList
    },
    total: function() {
      return this.wishListData.length
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      myWishList(this.listQuery).then(response => {
        // this.total = response.data.total
        this.wishList = response.data.list
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
