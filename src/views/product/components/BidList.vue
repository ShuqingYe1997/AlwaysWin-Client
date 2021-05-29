<template>
  <div>
    <el-table :data="productBidList" style="width: 100%;padding-top: 15px;" stripe>
      <el-table-column label="Username" width="150">
        <template slot-scope="{row}">
          {{ row.user.username | usernameFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Offer" width="150" align="center">
        <template slot-scope="{row}">
          ${{ row.offer | toThousandFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Placed Time" width="200" align="center">
        <template slot-scope="{row}">
          {{ row.createTime | formatDate }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  filters: {
    usernameFilter(str) {
      return str.charAt(0) + '***' + str.charAt(str.length - 1)
    }
  },
  props: {
    productBidList: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>
