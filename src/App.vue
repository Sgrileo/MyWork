<template>
  <a-locale-provider :locale="zhcn">
    <div id="app">
      <!-- <header-nav></header-nav> -->
      <div :style="{'min-height':boxheight}" style="background-color:#f4f4f4;">
        <router-view/>
      </div>
      <Footerr></Footerr>
    </div>
  </a-locale-provider>
</template>

<script>
import Footerr from '@/components/Footer'// 加载组件
import zhcn from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')
export default {
  components: {
    Footerr: Footerr
  },
  name: 'App',
  data () {
    return {
      boxheight: document.documentElement.clientHeight + 'px',
      zhcn
    }
  }
}
</script>

<style lang="less">
body {
  min-width: 1200px;
  background-color: #f4f4f4;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main-content {
  min-height: 600px;
}
</style>
