<template>
  <div>
    <header-nav :current="nowpage"></header-nav>
    <a-row type="flex" justify="center" class="userpart">
      <a-col :span="18">
        <a-avatar
          :src="$store.state.userInfo.avatar ? 'https://img.ixyclass.com/' + $store.getters.userInfo.avatar : ''"
          alt
          class="userAvtar"
        ></a-avatar>
        <div class="userName">
          <p class="name">Hi,{{$store.getters.userInfo.realname}}</p>
          <p>学习使我快乐</p>
        </div>
        <router-link to="/teacher/set" class="setlink">设置</router-link>
      </a-col>
    </a-row>
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
    console.log(this.$store.state.userInfo.roleType)
    console.log(23333)
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.userpart {
  position: relative;
  padding: 20px 0;
  background: linear-gradient(90deg, #ee3a43, #fdab55);
  background: -webkit-linear-gradient(
    90deg,
    #ee3a43,
    #fdab55
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    90deg,
    #ee3a43,
    #fdab55
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    90deg,
    #ee3a43,
    #fdab55,
    #b6e9f7
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(
    90deg,
    #ee3a43,
    #fdab55,
    #b6e9f7
  ); /* 标准的语法 */
}
.userAvtar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.setlink {
  float: right;
  margin-top: 30px;
  color: #fff;
}
.userName {
  display: inline-block;
  margin-left: 10px;
  color: #fff;
  p {
    margin-bottom: 2px;
  }
}
</style>
