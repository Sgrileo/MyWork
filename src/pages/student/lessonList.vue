<template>
  <div class="lessonList">
    <a-row type="flex" justify="center" class="actionNav">
      <a-col :span="18">
        <div class="btnPart">
          <router-link to="/student/lessonList">
            <a-button type="primary" class="actionBtn">我的课表</a-button>
          </router-link>
          <router-link to="/student/courseList">
            <a-button class="actionBtn">我的课程</a-button>
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
    <a-row type="flex" justify="center" class="lessonPart">
      <a-col :span="9">
        <div class="lessonItems">
          <h2>今日课表</h2>
          <div v-show="todayLessonList.length==0" class="nodata">
            <a-icon type="info-circle"/>暂时没有内容哦
          </div>
          <div v-show="todayLessonList.length>0">{{today.substring(0,11)}}</div>
          <!-- <div v-for="item in todayLessonList" :key="item.date" v-if="item.items.length>0"> -->
          <a-row v-for="lesson in todayLessonList" :key="lesson.id" class="lessonblock">
            <a-col :span="4">
              <img :src="lesson.courseImg" alt class="courImg">
            </a-col>
            <a-col :span="16" class="lessoninfo">
              <div>
                <span>{{lesson.name}}</span>
                <span>{{lesson.stringStartTime}}-{{lesson.stringEndTime}}</span>
                <a-badge count="录像" v-show="lesson.videoStatus!=0 && lesson.enterStatus!=2"/>
                <a-badge
                  count="未开课"
                  :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                  v-show="lesson.enterStatus==2"
                />
                <a-badge count="直播中" v-show="lesson.enterStatus==1"/>
                <a-badge
                  count="无录像"
                  :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                  v-show="lesson.videoStatus==0 && lesson.enterStatus==0"
                />
              </div>
              <div class="courseinfo">
                <span>{{lesson.courseName}}</span>
                <span>{{lesson.teacherName}}</span>
              </div>
            </a-col>
            <a-col :span="4">
              <div>
                <a
                  :href="'/clazz/login-clazz.php?lesson_id=' + lesson.id + '&course_id='+ lesson.courseId"
                  v-if="lesson.enterStatus==1 && lesson.videoStatus==0"
                >
                  <a-button type="primary" size="small">进入课堂</a-button>
                </a>
                <a-popover>
                  <template slot="content">开课前十分钟可进入课堂</template>
                  <a-button type="primary" v-if="lesson.enterStatus==2" disabled size="small">进入课堂</a-button>
                </a-popover>

                <a
                  :href="'/clazz/play.php?lesson_id=' + lesson.id + '&courseid=' + lesson.courseId + '&title=' + lesson.name"
                  v-if="lesson.enterStatus!=2 && lesson.videoStatus!=0"
                >
                  <a-button type="primary" size="small">查看录像</a-button>
                </a>
                <a-button
                  type="primary"
                  size="small"
                  v-if="lesson.hasCourseware"
                  @click="showdownload(lesson.id)"
                >下载课件</a-button>
                <a-popover>
                  <template slot="content">暂时没有课件可下载</template>
                  <a-button type="primary" size="small" v-if="!lesson.hasCourseware" disabled>下载课件</a-button>
                </a-popover>
              </div>
            </a-col>
          </a-row>
          <!-- </div> -->
        </div>
      </a-col>
      <a-col :span="9">
        <div class="lessonItems">
          <h2>未来七日课表</h2>
          <div v-for="item in futureLessonList" :key="item.date" v-if="item.items.length>0">
            <div>{{item.date}}</div>
            <a-row v-for="lesson in item.items" :key="lesson.id" class="lessonblock">
              <a-col :span="4">
                <img :src="lesson.courseImg" alt class="courImg">
              </a-col>
              <a-col :span="16" class="lessoninfo">
                <div>
                  <span>{{lesson.name}}</span>
                  <span>{{lesson.stringStartTime}}-{{lesson.stringEndTime}}</span>
                  <a-badge count="录像" v-show="lesson.videoStatus!=0 && lesson.enterStatus!=2"/>
                  <a-badge
                    count="未开课"
                    :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                    v-show="lesson.enterStatus==2"
                  />
                  <a-badge count="直播中" v-show="lesson.enterStatus==1"/>
                  <a-badge
                    count="无录像"
                    :numberStyle="{backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset'}"
                    v-show="lesson.videoStatus==0 && lesson.enterStatus==0"
                  />
                </div>
                <div class="courseinfo">
                  <span>{{lesson.courseName}}</span>
                  <span>{{lesson.teacherName}}</span>
                </div>
              </a-col>
              <a-col :span="4">
                <div>
                  <a
                    :href="'/clazz/login-clazz.php?lesson_id=' + lesson.id + '&course_id='+ lesson.courseId"
                    v-if="lesson.enterStatus==1 && lesson.videoStatus==0"
                  >
                    <a-button type="primary" size="small">进入课堂</a-button>
                  </a>
                  <a-popover>
                    <template slot="content">开课前十分钟可进入课堂</template>
                    <a-button type="primary" v-if="lesson.enterStatus==2" disabled size="small">进入课堂</a-button>
                  </a-popover>

                  <a
                    :href="'/clazz/play.php?lesson_id=' + lesson.id + '&courseid=' + lesson.courseId + '&title=' + lesson.name"
                    v-if="(lesson.enterStatus!=1 && lesson.videoStatus!=0) &&(lesson.enterStatus!=2)"
                  >
                    <a-button type="primary" size="small">查看录像</a-button>
                  </a>
                  <a-button
                    type="primary"
                    size="small"
                    v-if="lesson.hasCourseware"
                    @click="showdownload(lesson.id)"
                  >下载课件</a-button>
                  <a-popover>
                    <template slot="content">暂时没有课件可下载</template>
                    <a-button type="primary" size="small" v-if="!lesson.hasCourseware" disabled>下载课件</a-button>
                  </a-popover>
                </div>
              </a-col>
            </a-row>
          </div>
        </div>
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
const todaytime = new Date()
const tmrtime = new Date(todaytime.getTime() + 24 * 60 * 60 * 1000)
console.log(tmrtime)
export default {
  name: 'lessonList',
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      nowpage: ['index'],
      todayLessonList: [],
      visible: false,
      futureLessonList: [],
      filelists: [],
      today: this.dateformat(new Date())
    }
  },
  created () {
    this.getlesson()
    this.getfuturelesson()
  },
  methods: {
    dateformat: function (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    },
    getlesson: function () {
      axios({
        url: this.API1 + '/open/stu-manager/my-lesson-list.do',
        method: 'post',
        data: {}
      }).then((res) => {
        this.todayLessonList = res.data.rows
        console.log(this.lessonList)
      })
    },
    getfuturelesson: function () {
      console.log(tmrtime)
      axios({
        url: this.API1 + '/open/stu-manager/future-lesson-list.do',
        method: 'post',
        data: {
          pageIndex: 1,
          pageSize: 20,
          startTime: this.dateformat(tmrtime).substring(0, 11) + '00:00:00'
        }
      }).then((res) => {
        this.futureLessonList = res.data
        console.log(this.futureLessonList)
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
.lessonPart {
  margin-top: 15px;
  .lessonItems {
    background-color: #fff;
    padding: 15px;
    border-right: 1px solid #f4f4f4;
    h2 {
      font-size: 18px;
      color: #ee3a43;
      text-align: center;
    }
  }
}
.courImg {
  width: 100%;
}
.lessoninfo {
  padding-left: 5px;
}
.lessonblock {
  margin: 10px 0;
  .courseinfo {
    color: #888;
    font-size: 12px;
    margin-top: 5px;
  }
}
.fileitem {
  padding: 10px 0;
  border-bottom: 1px solid #f2f2f2;
  .download {
    float: right;
  }
}
.nodata {
  padding: 40px;
  text-align: center;
  color: #888;
}
.lessonItems {
  min-height: 400px;
}
</style>
