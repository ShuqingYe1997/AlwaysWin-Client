<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="statusSearch" placeholder="Auction Status" clearable class="filter-item" style="width: 200px;margin-right: 20px">
        <el-option
          v-for="item in Object.keys(productStatus)"
          :key="productStatus[item].value"
          :label="productStatus[item].text"
          :value="productStatus[item].value"
        />
      </el-select>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      brow
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'createTime', row: 'descending'}"
    >
      <el-table-column label="Created Time" width="150px" align="center" prop="createTime" sortable="custom">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product Name" min-width="150px">
        <template slot="header" slot-scope="scope"> <!--你大爷的，这句话必须要加，不要再报错了！-->
          <el-input
            v-model="titleSearch"
            prefix-icon="el-icon-search"
            placeholder="Search Product Name"
            size="small"
            class="filter-item"
            clearable
          />
        </template>
        <template slot-scope="{row}">
          <router-link type="primary" :to="'/product/' + row.productPreview.pid" :underline="false">
            <el-image
              style="width: 70px; height: 70px;margin-left: 10px;margin-right: 10px"
              :src="row.productPreview.url"
              fit="cover"
            />
            {{ row.productPreview.title | productTitleFilter }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Your Offer" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.offer | toThousandFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Current Price" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.productPreview.price | toThousandFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag
            :type="productStatus[row.productPreview.status].type"
            disable-transitions
            effect="plain"
          >{{ productStatus[row.productPreview.status].text }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { productStatus } from '@/api/product'
import { getMyBids } from '@/api/bid'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'BidHisrory',
  components: { Pagination },
  directives: { waves },
  filters: {
    productTitleFilter(str) {
      if (str.length > 60) {
        return str.substring(0, 60) + '...'
      } else return str
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      productStatus: productStatus(),
      statusSearch: '',
      titleSearch: ''
    }
  },
  computed: {
    tableData: function() {
      return this.list
        .filter(data => !this.statusSearch || data.productPreview.status === this.statusSearch)
        .filter(data => !this.titleSearch || data.productPreview.title.toLowerCase().includes(this.titleSearch.toLowerCase()))
        .slice((this.listQuery.page - 1) * this.listQuery.pageSize, this.listQuery.page * this.listQuery.pageSize)
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getMyBids(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    }
  }
}
</script>
