<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >

      <el-table-column label="Name" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Location" min-width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="State" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ZipCode" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.zipCode }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!--  pop up window  -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 350px; margin-left:50px;">
        <el-form-item label="Name" prop="name">
          <el-input v-model="temp.name" placeholder="Please input the receiver's name" width="200px" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="temp.phone" placeholder="Please input the receiver's phone" width="200px" />
        </el-form-item>
        <el-form-item label="Location" prop="location">
          <el-input v-model="temp.location" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" width="200px" placeholder="Please input your address" />
        </el-form-item>
        <el-form-item label="State" prop="state">
          <el-select v-model="temp.state" class="filter-item" placeholder="Please select the state" width="200px">
            <el-option v-for="item in stateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="ZipCode" prop="zipCode">
          <el-input v-model="temp.zipCode" placeholder="Please input the zip code" width="200px" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as addressAPI from '@/api/address'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const stateOptions = [
  { key: 'AL', display_name: 'ALABAMA' },
  { key: 'AK', display_name: 'ALASKA' },
  { key: 'AS', display_name: 'AMERICAN SAMOA' },
  { key: 'AZ', display_name: 'ARIZONA' },
  { key: 'AR', display_name: 'ARKANSAS' },
  { key: 'CA', display_name: 'CALIFORNIA' },
  { key: 'CO', display_name: 'COLORADO' },
  { key: 'CT', display_name: 'CONNECTICUT' },
  { key: 'DE', display_name: 'DELAWARE' },
  { key: 'DC', display_name: 'DISTRICT OF COLUMBIA' },
  { key: 'FL', display_name: 'FLORIDA' },
  { key: 'GA', display_name: 'GEORGIA' },
  { key: 'GU', display_name: 'GUAM' },
  { key: 'HI', display_name: 'HAWAII' },
  { key: 'ID', display_name: 'IDAHO' },
  { key: 'IL', display_name: 'ILLINOIS' },
  { key: 'IN', display_name: 'INDIANA' },
  { key: 'IA', display_name: 'IOWA' },
  { key: 'KS', display_name: 'KANSAS' },
  { key: 'KY', display_name: 'KENTUCKY' },
  { key: 'LA', display_name: 'LOUISIANA' },
  { key: 'ME', display_name: 'MAINE' },
  { key: 'MD', display_name: 'MARYLAND' },
  { key: 'MA', display_name: 'MASSACHUSETTS' },
  { key: 'MI', display_name: 'MICHIGAN' },
  { key: 'MN', display_name: 'MINNESOTA' },
  { key: 'MS', display_name: 'MISSISSIPPI' },
  { key: 'MO', display_name: 'MISSOURI' },
  { key: 'MT', display_name: 'MONTANA' },
  { key: 'NE', display_name: 'NEBRASKA' },
  { key: 'NV', display_name: 'NEVADA' },
  { key: 'NH', display_name: 'NEW HAMPSHIRE' },
  { key: 'NJ', display_name: 'NEW JERSEY' },
  { key: 'NM', display_name: 'NEW MEXICO' },
  { key: 'NY', display_name: 'NEW YORK' },
  { key: 'NC', display_name: 'NORTH CAROLINA' },
  { key: 'ND', display_name: 'NORTH DAKOTA' },
  { key: 'MP', display_name: 'NORTHERN MARIANA IS' },
  { key: 'OH', display_name: 'OHIO' },
  { key: 'OK', display_name: 'OKLAHOMA' },
  { key: 'OR', display_name: 'OREGON' },
  { key: 'PA', display_name: 'PENNSYLVANIA' },
  { key: 'PR', display_name: 'PUERTO RICO' },
  { key: 'RI', display_name: 'RHODE ISLAND' },
  { key: 'SC', display_name: 'SOUTH CAROLINA' },
  { key: 'SD', display_name: 'SOUTH DAKOTA' },
  { key: 'TN', display_name: 'TENNESSEE' },
  { key: 'TX', display_name: 'TEXAS' },
  { key: 'UT', display_name: 'UTAH' },
  { key: 'VT', display_name: 'VERMONT' },
  { key: 'VA', display_name: 'VIRGINIA' },
  { key: 'VI', display_name: 'VIRGIN ISLANDS' },
  { key: 'WA', display_name: 'WASHINGTON' },
  { key: 'WV', display_name: 'WEST VIRGINIA' },
  { key: 'WI', display_name: 'WISCONSIN' },
  { key: 'WY', display_name: 'WYOMING' }
]

export default {
  name: 'Address',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 暂时没用上
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        aid: undefined,
        uid: undefined,
        name: '',
        phone: '',
        location: '',
        state: '',
        zipCode: ''
      },
      stateOptions,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: 'Receiver\'s name is required', trigger: 'blur' }],
        phone: [{ required: true, message: 'Phone number is required', trigger: 'blur' }],
        location: [{ required: true, message: 'Your address is required', trigger: 'blur' }],
        state: [{ required: true, message: 'State is required', trigger: 'change' }],
        zipCode: [{ required: true, message: 'Zipcode is required', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      addressAPI.getMyAddress().then(response => {
        this.list = response.data

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        aid: undefined,
        uid: this.$store.getters.uid,
        name: '',
        phone: '',
        location: '',
        state: '',
        zipCode: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addressAPI.createAddress(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          addressAPI.updateAddress(tempData.aid, tempData).then(() => {
            const index = this.list.findIndex(v => v.aid === this.temp.aid)
            this.list.splice(index, 1, this.temp)
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
    },

    handleDelete(row, index) {
      addressAPI.deleteAddress(row.aid).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    }
  }
}
</script>
