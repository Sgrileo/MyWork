<template>
  <div>
    <header-nav :current="nowpage"></header-nav>
    <router-view></router-view>
  </div>
</template>
<script>
// import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
export default {
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      nowpage: ['']
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less">
</style>
