<template>
  <div>
    <div
      v-if="product.status === 'waiting'"
      class="waiting-item"
    >
      Time before starting
      <Countdown :deadline="product.startTime | formatDate1" />
    </div>
    <div
      v-if="product.status === 'bidding'"
      class="bidding-item"
    >
      Time before ending
      <Countdown :deadline="product.endTime | formatDate1" />
    </div>
    <div
      v-if="product.status.includes('extended')"
      class="extended-item"
    >
      The deadline is approaching!
      <Countdown :deadline="product.endTime | formatDate1" />
    </div>
    <div
      v-if="product.status === 'success' || product.status === 'broughtIn'"
      class="info-item"
    >
      Auction has finished!
    </div>
    <div v-if="product.status === 'canceled'" class="info-item">
      This product is canceled!
    </div>
  </div>
</template>

<script>
import Countdown from 'vuejs-countdown'

export default {
  name: 'ProductCountDown',
  components: { Countdown },

  props: {
    product: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.waiting-item {
    position: relative;
    text-align: center;
    color: #42b983;
    top: 0px;
    font-size: 16px;
  }

  .bidding-item {
    position: relative;
    text-align: center;
    color: #F7BA2A;
    top: 0px;
    font-size: 16px;
  }

  .extended-item {
    position: relative;
    text-align: center;
    color: #C03639;
    top: 0px;
    font-size: 16px;
}
  .info-item {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    color: #616b7a;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>
