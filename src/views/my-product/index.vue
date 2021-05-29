<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="statusSearch" placeholder="Auction Status" clearable class="filter-item" style="width: 200px;margin-right: 20px">
        <el-option
          v-for="item in Object.keys(productStatus)"
          :key="productStatus[item].value"
          :label="productStatus[item].label"
          :value="productStatus[item].value"
        />
      </el-select>
      <el-button
        v-waves
        type="primary"
        icon="el-icon-document-add"
        class="filter-item"
        style="float: right;"
        @click="handleNew"
      >Create new product
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      brow
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'pid', row: 'descending'}"
    >
      <el-table-column label="Product id" width="130px" align="center" prop="pid" sortable fixed>
        <template slot-scope="{row}">
          <span>{{ row.pid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product Name" width="450px" min-width="150px">
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
          <el-image style="width: 70px; height: 70px;margin-left: 10px;margin-right: 10px" :src="row.url" fit="cover" />
          <router-link type="primary" :to="'/product/' + row.pid" :underline="false">
            {{ row.title | productTitleFilter }}
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Category" width="130" align="center">
        <template slot-scope="{row}">
          <el-tag type="info">
            {{ productCate[row.cate1].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Current Price" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.price | toThousandFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Autowin Price" width="130px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.autoWinPrice | toThousandFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Start Time" width="180px" align="center" prop="startTime">
        <template slot-scope="{row}">
          <span>{{ row.startTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="End Time" width="180px" align="center" prop="endTime">
        <template slot-scope="{row}">
          <span>{{ row.endTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag
            :type="productStatus[row.status].type"
            disable-transitions
            effect="plain"
          >{{ productStatus[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button :disabled="row.status!='waiting' && row.status!='broughtIn'" size="mini" type="primary" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button :disabled="row.status!='waiting' && row.status!='broughtIn'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { productStatus, getMyProducts, getProductCate, cancelProduct } from '@/api/product'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MyProduct',
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
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      productCate: getProductCate(),
      productStatus: productStatus(),
      pidSearch: '',
      statusSearch: '',
      titleSearch: ''
    }
  },
  computed: {
    tableData: function() {
      return this.list
        .filter(data => !this.statusSearch || data.status === this.statusSearch)
        .filter(data => !this.titleSearch || data.title.toLowerCase().includes(this.titleSearch.toLowerCase()))
    },
    total: function() {
      return this.tableData.length
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
    // todo: paging
      this.listLoading = true
      getMyProducts().then(response => {
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    },

    handleNew() {
      this.$router.push({
        name: 'CreateProduct',
        params: {
        }
      })
    },

    handleUpdate(row) {
      this.$router.push({
        name: 'UpdateProduct',
        params: {
          pid: row.pid
        }
      })
    },

    handleDelete(row, index) {
      if (row.status === 'waiting' || row.status === 'broughtIn') {
        this.$confirm('Delete this product for sure?', 'Warning', {
          confirmButtonText: 'Comfirm',
          cancelButtonText: 'Cancel',
          type: 'danger'
        }).then(() => {
          cancelProduct(row.pid).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        }).catch(err => { console.log(err) })
      }
    }
  }
}
</script>
