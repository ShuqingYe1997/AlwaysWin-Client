<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="statusSearch" placeholder="Order Status" clearable class="filter-item" style="width: 130px;margin-right: 20px">
        <el-option
          v-for="item in Object.keys(orderStatus)"
          :key="orderStatus[item].value"
          :label="orderStatus[item].text"
          :value="orderStatus[item].value"
        />
      </el-select>
      <el-input
        v-model="numberSearch"
        prefix-icon="el-icon-search"
        placeholder="Search Order Number"
        style="width: 300px;margin-right: 20px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleSearch"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">
        Search
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'createTime', order: 'descending'}"
    >
      <el-table-column label="Number" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Created Time" width="150px" align="center" prop="createTime" sortable="custom" :format="formatOptions">
        <template slot-scope="{row}">
          <span>{{ row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Product Name" min-width="150px" align="center">
        <template slot="header">
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
          <el-link type="primary" :href="'#/product/' + row.productPreview.pid" :underline="false">
            {{ row.productPreview.title | productTitleFilter }}
          </el-link>
          <el-tag style="margin-left: 10px">{{ row.productPreview.cate1 }}</el-tag>
        </template>
      </el-table-column>

      <!--thumbnail-->
      <!-- <el-table-column label="Author" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column> -->

      <!--  address  -->

      <el-table-column label="Price" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.productPreview.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Payment" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag
            :type="orderStatus[row.status].type"
            disable-transitions
            effect="plain"
          >{{ orderStatus[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.status=='placed'" size="mini" type="primary" @click="handleUpdate(row)">
            Pay
          </el-button>
          <el-button v-if="row.status=='shipped'" size="mini" type="success" @click="handleUpdate(row)">
            Receive
          </el-button>
          <el-button :disabled="row.status!='received'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />

  </div>
</template>

<script>
import { getOrderByNumber, getMyOrder, updateOrder, deleteOrder, getOrderStatus } from '@/api/order'
import { productCat } from '@/api/enum'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
const productCatKeyValue = productCat.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export default {
  name: 'BuyingOrderTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    cateFilter(cate) {
      return productCatKeyValue[cate]
    },

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
      productCat,
      orderStatus: getOrderStatus(),
      statusSearch: '',
      titleSearch: '',
      numberSearch: '',
      formatOptions: { format: 'MM-dd-yyyy', type: 'date' }
    }
  },
  computed: {
    tableData: function() {
      return this.list
        .filter(data => !this.statusSearch || data.status === this.statusSearch)
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
      getMyOrder(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    },

    handleSearch() {
      if (this.numberSearch === '') {
        this.getList()
      } else {
        getOrderByNumber(this.numberSearch).then(response => {
          this.list = [response.data] // this.list has to be a list
          this.total = 1
          setTimeout(() => {
            this.listLoading = false
          }, 200)
        })
      }
    }
  },

  handleUpdate(row) {
    this.temp = Object.assign({}, row) // copy obj
    this.temp.timestamp = new Date(this.temp.timestamp)
    this.dialogFormVisible = true
    this.$nextTick(() => {
      this.$refs['dataForm'].clearValidate()
    })
  },

  handleDelete(row, index) {
    this.$confirm('Delete this order for sure?', 'Warning', {
      confirmButtonText: 'Comfirm',
      cancelButtonText: 'Cancel',
      type: 'danger'
    }).then(() => {
      deleteOrder(row.oid).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    })
  },

  formatJson(filterVal) {
    return this.list.map(v => filterVal.map(j => {
      if (j === 'createdTime') {
        return parseTime(v[j])
      } else {
        return v[j]
      }
    }))
  }
}
</script>
