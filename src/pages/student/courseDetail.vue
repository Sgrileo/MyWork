<template>
  <div class="courseDetail">
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
    <a-row type="flex" justify="center" class="marginbtm">
      <a-col :span="18">
        <div class="courseinfo">
          <a-row>
            <a-col :span="6">
              <img :src="coursedetail.courseImg" alt class="courseImg">
            </a-col>
            <a-col :span="18" class="courseTextInfo">
              <div class="courseTitle">{{coursedetail.courseName}}</div>
              <div>直播进度：{{coursedetail.upToCount}}/{{coursedetail.totalCount}}</div>
              <div>{{coursedetail.schoolName}}</div>
              <div v-show="coursedetail.goodsStatus==-1">内部课程</div>
              <div v-show="coursedetail.goodsStatus==0">已下架</div>
            </a-col>
            <!-- <a-progress
              size="small"
              :percent="coursedetail.hadStudiedCount/coursedetail.totalCount*100|num"
              :width="80"
            />-->
          </a-row>
        </div>
        <a-tabs defaultActiveKey="1" class="container">
          <a-tab-pane tab="课时列表" key="1">
            <div class="lessonitems">
              <a-row class="lessonitem" v-for="(lesson, index) in lessonlist" :key="lesson.id">
                <a-col :span="2">第{{index+1}}节</a-col>
                <a-col :span="14">
                  <div>
                    {{lesson.lessonName}}
                    <a-badge count="录像" v-show="lesson.videoStatus!=0 && lesson.enterStatus!=2"/>
                    <a-badge
                      count="未开课"
                      :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                      v-show="lesson.enterStatus==2"
                    />
                    <a-badge count="上课中" v-show="lesson.enterStatus==1 && lesson.videoStatus==0"/>
                    <a-badge
                      count="无录像"
                      :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                      v-show="lesson.enterStatus==0 && lesson.videoStatus==0"
                    />
                  </div>
                </a-col>
                <a-col :span="4">
                  <div
                    class="timeinfo"
                  >{{lesson.startTime.substring(0,16)}}-{{lesson.endTime.substring(11,16)}}</div>
                </a-col>
                <a-col :span="2">
                  <a-popover>
                    <template slot="content">开课前十分钟可进入课堂</template>
                    <a-button type="primary" v-if="lesson.enterStatus==2" disabled size="small">进入课堂</a-button>
                  </a-popover>
                  <a
                    :href="'/clazz/login-clazz.php?lesson_id='+ lesson.lessonId + '&course_id=' + coursedetail.courseId"
                    v-if="lesson.enterStatus==1 && lesson.videoStatus==0"
                  >
                    <a-button type="primary" size="small">进入课堂</a-button>
                  </a>
                  <a
                    :href="'/clazz/play.php?lesson_id='+ lesson.lessonId + '&courseid='+coursedetail.courseId+'&title='+lesson.lessonName"
                  >
                    <a-button
                      type="primary"
                      v-if="lesson.enterStatus!=2 && lesson.videoStatus!=0"
                      size="small"
                    >查看录像</a-button>
                  </a>
                </a-col>
                <a-col :span="2">
                  <a-button
                    type="primary"
                    size="small"
                    v-if="lesson.hasCourseware"
                    @click="showdownload(lesson.lessonId)"
                  >下载课件</a-button>
                  <a-popover>
                    <template slot="content">暂时没有课件可下载</template>
                    <a-button type="primary" size="small" v-if="!lesson.hasCourseware" disabled>下载课件</a-button>
                  </a-popover>
                </a-col>
              </a-row>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="课程简介" key="2">
            <div v-html="coursedetail.courseIntro" class="courseintr"></div>
            <div v-if="!coursedetail.courseIntro" class="courseintr textcenter">
              <a-icon type="info-circle"/>暂时没有内容哦
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <!-- 下载课件拟态窗口 -->
    <a-modal v-model="visible" title="课件下载" onOk="handleOk" footer>
      <div v-for="file in filelists" :key="file.id" class="fileitem" v-if="file.offerDownload">
        <a-icon type="file"/>
        {{file.originalName}}
        <a :href="file.keyPath" class="download">
          <a-button type="primary" size="small">下载</a-button>
        </a>
        <a-button type="primary" size="small" disabled v-if="!file.offerDownload">下载</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
// import Footerr from '@/components/Footer'
export default {
  name: 'courseList',
  components: {
    HeaderNav: HeaderNav
    // Footerr: Footerr,
  },
  data () {
    return {
      nowpage: ['index'],
      coursedetail: {},
      courseId: this.$route.query.courseId,
      lessonlist: [],
      filelists: [],
      visible: false
    }
  },
  created () {
    this.getCourseDetail()
    console.log(this.$route.query.courseId)
    this.getlessonlist()
  },
  methods: {
    getCourseDetail: function () {
      axios({
        url: this.API1 + '/open/stu-manager/course-detail.do',
        method: 'post',
        data: {
          id: this.courseId
        }
      }).then((res) => {
        this.coursedetail = res.data.data
      })
    },
    getlessonlist: function () {
      axios({
        url: this.API1 + '/open/stu-manager/course-detail/lessonList.do',
        method: 'post',
        data: {
          courseId: this.courseId,
          order: 'asc',
          pageIndex: 1,
          pageSize: 200
        }
      }).then((res) => {
        this.lessonlist = res.data.rows
        console.log(this.lessonlist)
      }).catch((res) => {
      })
    },
    showdownload: function (id) {
      this.visible = true
      axios({
        url: this.API1 + '/student/lesson-file-list.do',
        method: 'post',
        data: {
          id: id
        }
      }).then((res) => {
        this.filelists = res.data.rows
        console.log(this.filelists)
      })
    }
  },
  filters: {
    num: function (value) {
      return (Math.round(value))
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  background-color: #fff;
}
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
.courseinfo {
  margin-top: 20px;
  background-color: #fff;
  .courseImg {
    width: 100%;
  }
  .courseTextInfo {
    padding: 10px;
    position: relative;
  }
}
.pages {
  margin: 15px 0 15px 10px;
}
.courseintr {
  padding: 0 20px 20px 20px;
}
.lessonitem {
  padding: 10px 15px;
  border-bottom: 1px solid #f2f2f2;
  .timeinfo {
    font-size: 12px;
    color: #888;
  }
}
.textcenter {
  text-align: center;
}
.marginbtm {
  margin-bottom: 40px;
}
</style>
