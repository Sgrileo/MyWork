<template>
  <div class="realindex">
    <header-nav :current="nowpage"></header-nav>
    <a-carousel autoplay>
      <div v-for="item in banners" :key="item.id">
        <div v-bind:style="{'background-color':'#'+item.backColor}">
          <a-row type="flex" justify="center">
            <a-col :span="18">
              <img :src="item.img" alt class="bannerimg">
            </a-col>
          </a-row>
        </div>
      </div>
    </a-carousel>
    <div class="recommendBlock">
      <a-row type="flex" justify="center">
        <a-col :span="18">
          <h2 class="recommendTitle">
            本周推荐
            <router-link to="/market">
              <span class="more">
                更多课程
                <a-icon type="right"/>
              </span>
            </router-link>
          </h2>
          <a-row class="courses">
            <a-col :span="6" v-for="item in RecommendList" :key="item.courseId">
              <router-link :to="{path:'/courseDetail',query: {courseId: item.courseId}}">
                <course-block :course="item"></course-block>
              </router-link>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
import Footerr from '@/components/Footer'
import CourseBlock from '@/components/CourseBlock'
export default {
  components: {
    HeaderNav: HeaderNav,
    Footerr: Footerr,
    CourseBlock: CourseBlock
  },
  data () {
    return {
      nowpage: ['index'],
      banners: [],
      RecommendList: [],
      NewList: []
    }
  },
  created () {
    this.getbanners()
    this.getrecommdcourse()
  },
  methods: {
    getbanners: function () {
      axios({
        url: this.API1 + '/open/market/banner-list.do',
        method: 'post',
        data: {}
      }).then((res) => {
        this.banners = res.data
        console.log(this.banners)
      })
    },
    getrecommdcourse: function () {
      axios({
        url: this.API1 + '/open/market/recommend-goods-list.do',
        method: 'post',
        data: {
          v: 1
        }
      }).then((res) => {
        this.RecommendList = res.data.rows
        console.log(res.data.rows)
      }).catch((res) => {
        // this.showConfirm()
      })
    }
    // showConfirm: function () {
    //   this.$confirm({
    //     title: '还未登录，是否登录',
    //     okText: '去登陆',
    //     okType: 'primary',
    //     cancelText: '取消',
    //     onOk () {
    //       console.log('OK')
    //     },
    //     onCancel () {
    //       console.log('Cancel')
    //     },
    //     class: 'test'
    //   })
    // }
  }
}
</script>
<style lang="less" scoped>
.bannerimg {
  object-fit: cover;
  height: 400px;
}
.recommendBlock {
  margin-top: 20px;
  .more {
    font-size: 14px;
    float: right;
    margin-top: 10px;
  }
}
.courses {
  margin-left: -10px;
  margin-top: -20px;
}
</style>
