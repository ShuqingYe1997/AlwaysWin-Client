<template>
  <span> {{productInfo.description}} </span>
</template>



<script>
export default {

  props: {
    productInfo: {
      type: Object,
      default: {} 
    }
  },
  data() {
    return {
    }
  }
}
</script>
