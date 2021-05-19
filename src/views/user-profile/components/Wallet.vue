<template>
  <div class="components-container">
    <count-to
      ref="balance"
      :start-val="startVal"
      :end-val="endVal"
      :duration="duration"
      :decimals="decimals"
      :separator="separator"
      :prefix="prefix"
      :autoplay="true"
      class="balance"
    />
    <div class="box-center">
      <el-button type="primary" icon="el-icon-money" style="bottom: 15px;" @click="dialogFormVisible = true">
        Add Fund
      </el-button>
    </div>

    <!--  pop up window  -->
    <el-dialog title="Add fund" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Amount" prop="amount">
          <el-select v-model="query.amount" class="filter-item" placeholder="Select the amount" width="300px">
            <el-option v-for="item in amountOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import countTo from 'vue-count-to'
import { getInfo, addFund } from '@/api/user'

const amountOptions = [
  { key: '10', display_name: '$10' },
  { key: '20', display_name: '$20' },
  { key: '50', display_name: '$50' },
  { key: '100', display_name: '$100' },
  { key: '200', display_name: '$200' },
  { key: '500', display_name: '$500' },
  { key: '1000', display_name: '$1,000' },
  { key: '2000', display_name: '$2,000' },
  { key: '5000', display_name: '$5,000' }
]

export default {
  name: 'Wallet',
  components: { countTo },
  // props: {
  //   uid: {
  //     type: String,
  //     default: ''
  //   }
  // },
  data() {
    return {
      startVal: 0,
      endVal: 0,
      duration: 2000,
      decimals: 0,
      separator: ',',
      prefix: '$ ',
      dialogFormVisible: false,
      amountOptions,
      user: {
        balance: 0
      },
      query: {
        balance: 0,
        amount: ''
      }
    }
  },
  watch: {
    user: function() {
      this.endVal = this.user.balance
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      getInfo().then(response => {
        this.user = { ...response.data }
      })
    },

    updateData() {
      this.query.balance = this.user.balance + '' // param has to be string
      console.log('original balance ' + this.query.balance)
      addFund(this.query).then(() => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
        // reflesh
        this.user.balance += parseInt(this.query.amount)
        this.endVal = this.user.balance
      })
    }
  }
}
</script>

<style scoped>
.balance-btn {
  display: inline-block;
  margin-bottom: 0;
  font-weight: 500;
  text-align: center;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  background-image: none;
  border: 1px solid transparent;
  white-space: nowrap;
  line-height: 1.5;
  padding: 4px 15px;
  font-size: 12px;
  border-radius: 4px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
  transition: all .3s cubic-bezier(.645, .045, .355, 1);
  position: relative;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  border-color: #d9d9d9;
}
.balance-btn:hover {
  color: #4AB7BD;
  background-color: #fff;
  border-color: #4AB7BD;
}
.balance {
  font-size: 50px;
  color: #42b983;
  display: block;
  margin: 10px 0;
  text-align: center;
  font-size: 80px;
  font-weight: 500;
}
.label {
  color: #2f4f4f;
  font-size: 16px;
  display: inline-block;
  margin: 15px 30px 15px 0;
}
input {
  position: relative;
  display: inline-block;
  padding: 4px 7px;
  width: 70px;
  height: 28px;
  cursor: text;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(0, 0, 0, .65);
  background-color: #fff;
  background-image: none;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all .3s;
  transition: all .3s;
}
</style>
