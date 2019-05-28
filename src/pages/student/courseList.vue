<template>
  <div class="courseList">
    <a-row type="flex" justify="center" class="actionNav">
      <a-col :span="18">
        <div class="btnPart">
          <router-link to="/student/lessonList">
            <a-button class="actionBtn">我的课表</a-button>
          </router-link>
          <router-link to="/student/courseList">
            <a-button type="primary" class="actionBtn">我的课程</a-button>
          </router-link>
          <!-- <router-link to="/student/lessonList">
            <a-button class="actionBtn">我的订单</a-button>
          </router-link>-->
          <router-link to="/student/set">
            <a-button class="actionBtn">个人设置</a-button>
          </router-link>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" class="courseBlocks">
      <a-col :span="18">
        <a-row>
          <a-col :span="6" v-for="item in courseList" :key="item.courseId">
            <router-link :to="{path:'/student/mycoursedetail',query: {courseId: item.courseId}}">
              <my-course-block :course="item"></my-course-block>
            </router-link>
          </a-col>
        </a-row>
        <a-pagination
          v-model="pageIndex"
          :total="total"
          :defaultPageSize="16"
          @change="changepage"
          class="pages"
        />
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
// import Footerr from '@/components/Footer'
import MyCourseBlock from '@/components/MyCourseBlock'
export default {
  name: 'courseList',
  components: {
    HeaderNav: HeaderNav,
    // Footerr: Footerr,
    MyCourseBlock: MyCourseBlock
  },
  data () {
    return {
      nowpage: ['index'],
      courseList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 16
    }
  },
  created () {
    this.getlesson()
    this.getmycourse()
  },
  methods: {
    getlesson: function () {
      axios({
        url: this.API1 + '/open/stu-manager/my-lesson-list.do',
        method: 'post',
        data: {}
      }).then((res) => {
        this.lessonList = res.data.rows
        console.log(this.lessonList)
      })
    },
    getmycourse: function () {
      axios({
        url: this.API1 + '/open/stu-manager/my-course-list.do',
        method: 'post',
        data: {
          categoryIds: [],
          pageIndex: this.pageIndex,
          pageSize: 16
        }
      }).then((res) => {
        this.courseList = res.data.rows
        this.total = res.data.total
        console.log(res.data.rows)
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    changepage: function (page, pageSize) {
      this.pageIndex = page
      this.getmycourse()
    }
  }
}
</script>
<style lang="less" scoped>
.actionNav {
  background-color: #fff;
  .btnPart {
    padding: 20px 10px;
    .actionBtn {
      border-radius: 16px;
      margin-right: 40px;
    }
  }
}
.courseBlocks {
  margin-top: 15px;
}
.pages {
  margin: 15px 0 15px 10px;
}
</style>
