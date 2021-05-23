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
      brow
      fit
      highlight-current-row
      style="width: 100%;"
      :default-sort="{prop: 'createTime', row: 'descending'}"
    >
      <el-table-column label="Number" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.number }}</span>
        </template>
      </el-table-column>
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
          <el-image style="width: 70px; height: 70px;margin-left: 10px;margin-right: 10px" :src="row.productPreview.url" fit="cover" />
          <el-link type="primary" :href="'/product/' + row.productPreview.pid" :underline="false">
            {{ row.productPreview.title | productTitleFilter }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column label="Price" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.productPreview.price | toThousandFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Payment" width="110px" align="center">
        <template slot-scope="{row}">
          <span>${{ row.payment | toThousandFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Address" width="130px" align="center">
        <template slot-scope="{row}">
          <el-popover trigger="hover" placement="top" :content="row.address">
            <span slot="reference">{{ row.address | addressFilter }}</span>
          </el-popover>
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

    <el-dialog title="Pay My Order" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Order Number" prop="number">
          <el-input v-model="temp.number" :disabled="true" />
        </el-form-item>
        <el-form-item label="Payment" prop="payment">
          <el-input v-model="temp.payment" :disabled="true" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-select v-model="temp.address" class="selector" placeholder="Please choose your delivery address">
            <el-option
              v-for="item in addressList"
              :key="item.aid"
              :label="item.str"
              :value="item.str"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="updateData()">
          Pay
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getOrderByNumber, getMyOrder, updateOrder, deleteOrder, getOrderStatus } from '@/api/order'
import { getMyAddress } from '@/api/address'
import { productCat } from '@/api/enum'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

// arr to obj, such as { CN : "China", US : "USA" }
const productCatKeyValue = productCat.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})

export default {
  name: 'BuyingOrder',
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
    },
    addressFilter(str) {
      if (str.length > 20) {
        return str.substring(0, 20) + '...'
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
      dialogFormVisible: false,
      temp: {
        oid: 0,
        status: '',
        payment: 0,
        address: ''
      },
      addressList: [],
      rules: {
        address: [{ required: true, message: 'Address is required', trigger: 'change' }]
      }
    }
  },
  computed: {
    tableData: function() {
      return this.list
        .filter(data => !this.statusSearch || data.status === this.statusSearch)
        .filter(data => !this.titleSearch || data.productPreview.title.toLowerCase().includes(this.titleSearch.toLowerCase()))
        // .slice((this.listQuery.page - 1) * this.listQuery.pageSize, this.listQuery.page * this.listQuery.pageSize)
    }
  },
  created() {
    this.getList()
    this.getAddress()
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

    getAddress() {
      getMyAddress(this.listQuery).then(response => {
        const addresses = response.data.list
        for (const item of addresses) {
          const it = {
            aid: item.aid,
            str: item.name + ', ' + item.phone + ', ' + item.location + ', ' + item.state + ', ' + item.zipCode
          }
          this.addressList.push(it)
        }
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
    },

    handleUpdate(row) {
    // 签收
      if (row.status === 'shipped') {
        this.$confirm('Mark this order as received?', 'Confirm', {
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.temp = { ...row } // copy obj
          this.temp.status = 'received'
          updateOrder(row.oid, this.temp).then(() => {
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }).catch(err => { console.log(err) })
      } else { // 付钱 row.status === 'placed'
        this.temp = { ...row } // copy obj
        this.temp.payment = row.productPreview.price
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },

    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.status = 'paid'
          updateOrder(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
      this.getList()
    },

    handleDelete(row, index) {
      this.$confirm('Delete this row for sure?', 'Warning', {
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
    }
  }
}
</script>
