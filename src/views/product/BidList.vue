<template>
  <section class="todoapp">
    <el-table :data="filterlist" style="width: 100%;padding-top: 15px;">
      <el-table-column label="User" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.order_no | orderNoFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Offer" width="195" align="center">
        <template slot-scope="scope">
          ${{ scope.row.price | toThousandFilter }}
        </template>
      </el-table-column>
      <el-table-column label="Time" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <footer class="footer">
      <ul class="filters">
        <!--<a :class="{ selected: this.show_all === true}" @click="fetchList()">show all</a>-->
      </ul>
    </footer>
  </section>
</template>

<script>

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      filterlist: null,
      show_all: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
    // transactionList().then(response => {
    //     this.list = response.data.items
    //     this.filterlist = this.list.slice(0, 3)
    //   })
    // },
    // fetchList() {
    //   this.show_all = !this.show_all
    //   if (this.show_all === true) {
    //     this.filterlist = this.list
    //   } else {
    //     this.filterlist = this.list.slice(0, 3)
    //   }
    }
  }
}
</script>

<style lang="scss">
.todoapp {
  background: #fff;
}

.footer {
    color: #777;
    position: relative;
    padding: 10px 15px;
    height: 40px;
    text-align: center;
    border-top: 1px solid #e6e6e6;
  }
  .footer:before {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 40px;
    overflow: hidden;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6, 0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6, 0 17px 2px -6px rgba(0, 0, 0, 0.2);
  }

.filters {
    margin: 0;
    padding: 0;
    position: relative;
    z-index: 1;
    list-style: none;
  }
  .filters{
    display: inline;
  }
  .filters a {
    color: inherit;
    font-size: 14px;
    padding: 3px 7px;
    text-decoration: none;
    border: 1px solid transparent;
    border-radius: 3px;
  }
  .filters a:hover {
    border-color: rgba(175, 47, 47, 0.1);
  }
  .filters a.selected {
    border-color: rgba(175, 47, 47, 0.2);
  }
</style>
