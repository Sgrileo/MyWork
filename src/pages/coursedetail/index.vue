<template>
  <div class="courseDetail">
    <header-nav :current="nowpage"></header-nav>
    <a-row type="flex" justify="center" class="marginbtm">
      <a-col :span="18">
        <div class="courseinfo">
          <a-row>
            <a-col :span="6">
              <img :src="coursedetail.courseImg" alt class="courseImg">
            </a-col>
            <a-col :span="18" class="courseTextInfo">
              <div class="courseTitle">{{coursedetail.courseName}}</div>
              <div class="moreinfo">
                <span>
                  <a-icon type="user"/>
                  {{coursedetail.purchaseNum}}
                </span>
                <span>
                  <a-icon type="home"/>
                  {{coursedetail.schoolName}}
                </span>
                <span>
                  <a-icon type="video-camera"/>
                  直播进度：{{coursedetail.upToCount}}/{{coursedetail.totalCount}}
                </span>
              </div>
              <div class="pricepart">
                <p
                  v-if="coursedetail.discountPrice>0"
                  class="currentPrice"
                >￥{{coursedetail.discountPrice}}</p>
                <p class="currentPrice freePrice" v-if="coursedetail.discountPrice==0">公开课</p>
              </div>
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
                <a-col :span="4">
                  <div
                    v-if="lesson.purchaseStatus==1 || coursedetail.discountPrice==0 || lesson.free==1"
                    style="display:inline-block;"
                  >
                    <a-popover>
                      <template slot="content">开课前十分钟可进入课堂</template>
                      <a-button
                        type="primary"
                        v-if="lesson.enterStatus==2"
                        disabled
                        size="small"
                      >进入课堂</a-button>
                    </a-popover>
                    <a
                      :href="'/clazz/login-clazz.php?lesson_id='+lesson.lessonId"
                      v-if="lesson.enterStatus==1"
                    >
                      <a-button type="primary" size="small">进入课堂</a-button>
                    </a>
                    <a
                      :href="'/clazz/play.php?lesson_id='+lesson.lessonId+'&courseid='+lesson.courseId+'&title='+lesson.lessonName"
                      v-if="lesson.enterStatus!=1 && lesson.videoStatus!=0"
                    >
                      <a-button type="primary" size="small">查看录像</a-button>
                    </a>
                    <a-button
                      type="primary"
                      size="small"
                      disabled
                      v-if="(lesson.enterStatus!=1 && lesson.enterStatus!=2) && lesson.videoStatus==0"
                    >没有录像</a-button>
                  </div>
                  <a-button
                    type="primary"
                    size="small"
                    v-if="lesson.hasCourseware"
                    @click="showdownload(lesson.lessonId)"
                  >
                    <a-icon type="download"/>
                  </a-button>
                  <a-popover>
                    <template slot="content">暂时没有课件可下载</template>
                    <a-button type="primary" size="small" v-if="!lesson.hasCourseware" disabled>
                      <a-icon type="download"/>
                    </a-button>
                  </a-popover>
                  <!-- <a-popover>
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
                    <a-button type="primary" v-if="lesson.videoStatus!=0" size="small">查看录像</a-button>
                  </a>
                  <a-button
                    type="primary"
                    size="small"
                    v-if="lesson.hasCourseware"
                    @click="showdownload(lesson.lessonId)"
                  >
                    <a-icon type="download"/>
                  </a-button>
                  <a-popover>
                    <template slot="content">暂时没有课件可下载</template>
                    <a-button type="primary" size="small" v-if="!lesson.hasCourseware" disabled>
                      <a-icon type="download"/>
                    </a-button>
                  </a-popover>-->
                </a-col>
                <!-- <a-col :span="2">
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
                </a-col>-->
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
      nowpage: ['market'],
      coursedetail: {},
      courseId: this.$route.query.courseId,
      lessonlist: [],
      filelists: [],
      visible: false
    }
  },
  created () {
    this.getCourseDetail()
    this.getlessonlist()
    console.log(this.$route.query.courseId)
  },
  methods: {
    getCourseDetail: function () {
      axios({
        url: this.API1 + '/open/market/course-detail.do',
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
        url: this.API1 + '/open/market/course-lesson-list.do',
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
    }
  },
  filters: {
  }
}
</script>
<style lang="less" scoped>
.courseinfo {
  margin-top: 20px;
  background-color: #fff;
  padding: 10px;
  .moreinfo {
    margin-top: 5px;
    font-size: 12px;
    color: #aaa;
    span {
      margin-right: 20px;
    }
  }
  .pricepart {
    margin-top: 40px;
    .currentPrice {
      font-size: 16px;
      color: #ee3a43;
    }
    .freePrice {
      color: #5fb860;
    }
  }
  .courseTitle {
    font-size: 16px;
  }
  .courseImg {
    width: 100%;
  }
  .courseTextInfo {
    padding-left: 20px;
    position: relative;
  }
}
.container {
  background-color: #fff;
  .courseintr {
    padding: 10px 0;
  }
  .textcenter {
    text-align: center;
  }
  .lessonitem {
    padding: 10px 15px;
    border-bottom: 1px solid #f2f2f2;
    .timeinfo {
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
