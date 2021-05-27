<template>
  <div :class="{'show':show}" class="header-search">
    <el-input
      ref="headerSearchSelect"
      v-model="keyword"
      placeholder="Search for products"
      class="header-search-select"
      @keyup.enter.native="handleSearch"
    />
    <svg-icon class-name="search-icon" icon-class="search" @click="handleSearch" />

  </div>
</template>

<script>

export default {
  name: 'HeaderSearch',
  data() {
    return {
      keyword: null,
      total: 0,
      show: true
    }
  },
  methods: {
    handleSearch() {
      if (this.keyword && this.keyword.trim().length > 0) {
        this.$router.push({
          path: '/product',
          query: {
            keyword: this.keyword,
            t: +new Date()// 强制刷新view
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 14px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 1;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 400px;
      margin-left: 10px;
    }
  }
}
</style>
