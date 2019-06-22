<template>
  <div class="lessonList">
    <a-row type="flex" justify="center" class="userpart">
      <a-col :span="18">
        <a-row>
          <a-col :span="6" class="leftnav">
            <div class="actionlink">
              <router-link to="/teacher/teachertimeTable">
                <div class="linkItem activelink">我的课表</div>
              </router-link>
              <router-link to="/teacher/teachercourseList">
                <div class="linkItem">我的课程</div>
              </router-link>
            </div>
          </a-col>
          <a-col :span="18" class="rightpart">
            <div style="background:#fff;">
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="今日课表" key="1">
                  <a-icon type="calendar"/>
                  {{today.substring(0,11)}}
                  <a-table
                    :columns="columns"
                    :dataSource="timeTable"
                    :pagination="false"
                    class="lessontable"
                  >
                    <div slot="name" slot-scope="record">
                      <div>{{record.name}}</div>
                      <div class="belongcourse">所属课程:{{record.courseName}}</div>
                    </div>
                    <div slot="time" slot-scope="record">
                      <div>{{record.startTime.substring(11,16)}}-{{record.endTime.substring(11,16)}}</div>
                    </div>
                    <div slot="action" slot-scope="record">
                      <a :href="'/clazz/login-clazz.php?lesson_id=' + record.id">
                        <a-button
                          type="primary"
                          v-if="record.enterStatus==1&&record.videoStatus==0"
                          size="small"
                        >进入课堂</a-button>
                      </a>
                      <a-popover>
                        <template slot="content">开课前三十分钟可进入课堂</template>
                        <a-button
                          type="primary"
                          v-if="record.enterStatus==2"
                          disabled
                          size="small"
                        >进入课堂</a-button>
                      </a-popover>
                      <a :href="'/clazz/play.php?lesson_id='+ record.id">
                        <a-button type="primary" v-if="record.videoStatus!=0" size="small">查看录像</a-button>
                      </a>
                      <a-upload
                        name="file"
                        accept=".flv"
                        :action="'/upload/flv-file.do'"
                        :data="{'lessonId':record.id}"
                        :beforeUpload="beforeUpload"
                        @change="videoChange"
                      >
                        <a-button type="primary" v-if="record.videoStatus==0" size="small">上传录像</a-button>
                      </a-upload>
                      <a-button
                        type="primary"
                        v-if="record.videoStatus==2"
                        disabled
                        size="small"
                      >录像转码中</a-button>
                      <a-button
                        type="primary"
                        v-if="record.videoStatus==3"
                        disabled
                        size="small"
                      >转码失败</a-button>
                      <a-button
                        type="primary"
                        size="small"
                        v-if="record.hasCourseware"
                        @click="showdownload(record.id)"
                      >下载课件</a-button>
                      <a-popover>
                        <template slot="content">暂时没有可下载课件</template>
                        <a-button
                          type="primary"
                          size="small"
                          v-if="!record.hasCourseware"
                          disabled
                        >下载课件</a-button>
                      </a-popover>
                    </div>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane tab="未来七天" key="2">
                  <div v-for="list in futureLessonList" :key="list.date" class="onedate">
                    <a-icon type="calendar"/>
                    {{list.date}}
                    <a-table
                      :columns="columns1"
                      :dataSource="list.rows"
                      :pagination="false"
                      class="lessontable"
                    >
                      <div slot="name" slot-scope="record">
                        <div>{{record.name}}</div>
                        <div class="belongcourse">所属课程:{{record.courseName}}</div>
                      </div>
                      <div slot="time" slot-scope="record">
                        <div>{{record.startTime.substring(11,16)}}-{{record.endTime.substring(11,16)}}</div>
                      </div>
                      <div slot="action" slot-scope="record">
                        <a :href="'/clazz/login-clazz.php?lesson_id=' + record.id">
                          <a-button
                            type="primary"
                            v-if="record.enterStatus==1&&record.videoStatus==0"
                            size="small"
                          >进入课堂</a-button>
                        </a>
                        <a-popover>
                          <template slot="content">开课前三十分钟可进入课堂</template>
                          <a-button
                            type="primary"
                            v-if="record.enterStatus==2"
                            disabled
                            size="small"
                          >进入课堂</a-button>
                        </a-popover>
                        <a :href="'/clazz/play.php?lesson_id='+ record.id">
                          <a-button type="primary" v-if="record.videoStatus!=0" size="small">查看录像</a-button>
                        </a>

                        <a-upload
                          name="file"
                          :action="'/upload/flv-file.do'"
                          :data="{'lessonId':record.id}"
                          :beforeUpload="beforeUpload"
                          @change="videoChange"
                        >
                          <a-button
                            type="primary"
                            v-if="record.videoStatus==0 && record.enterStatus!=1"
                            size="small"
                          >上传录像</a-button>
                        </a-upload>
                        <a-button
                          type="primary"
                          v-if="record.videoStatus==2"
                          disabled
                          size="small"
                        >录像转码中</a-button>
                        <a-button
                          type="primary"
                          v-if="record.videoStatus==3"
                          disabled
                          size="small"
                        >转码失败</a-button>
                        <a-button
                          type="primary"
                          size="small"
                          v-if="record.hasCourseware"
                          @click="showdownload(record.id)"
                        >下载课件</a-button>
                        <a-popover>
                          <template slot="content">暂时没有可下载课件</template>
                          <a-button
                            type="primary"
                            size="small"
                            v-if="!record.hasCourseware"
                            disabled
                          >下载课件</a-button>
                        </a-popover>
                      </div>
                    </a-table>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
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
const columns = [{
  title: '课时名称',
  key: 'name',
  // slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' }
}, {
  title: '上课时间',
  key: 'time',
  scopedSlots: { customRender: 'time' }
},
{
  title: '操作',
  key: 'actin',
  scopedSlots: { customRender: 'action' }
}]
const columns1 = [{
  title: '课时名称',
  key: 'name',
  // slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' }
}, {
  title: '上课时间',
  key: 'time',
  scopedSlots: { customRender: 'time' }
},
{
  title: '操作',
  key: 'actin',
  scopedSlots: { customRender: 'action' }
}]
console.log(tmrtime)
export default {
  name: 'lessonList',
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      nowpage: ['index'],
      timeTable: [],
      futureLessonList: [],
      columns: columns,
      columns1: columns1,
      fileList: [],
      filelists: [],
      visible: false,
      today: this.dateformat(new Date())
    }
  },
  created () {
    this.getlesson()
    this.getfuturelesson()
  },
  methods: {
    videoChange: function (info) {
      if (info.file.status === 'done') {
        this.$message.success('文件上传成功')
        this.getlesson()
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败，请重试')
      }
    },
    beforeUpload: function (file) {
      const isflv = file.name.substring(file.name.length - 4, file.name.length).toLowerCase() === '.flv'
      if (!isflv) {
        this.$message.error('只能上传FLV文件')
        this.fileList = []
      }
      const isLt2M = file.size / 1024 / 1024 < 300
      if (!isLt2M) {
        this.$message.error('文件要小于300M')
        this.fileList = []
      }
      return isflv && isLt2M
    },
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
        url: this.API1 + '/teacher/my-lesson-list.do',
        method: 'post',
        data: {}
      }).then((res) => {
        this.timeTable = res.data.rows[0].rows
        console.log(this.lessonList)
      })
    },
    getfuturelesson: function () {
      axios({
        url: this.API1 + '/teacher/future-lesson-list.do',
        method: 'post',
        data: {
          pageIndex: 1,
          pageSize: 200
        }
      }).then((res) => {
        this.futureLessonList = res.data.rows
        console.log(this.futureLessonList)
      })
    },
    showdownload: function (id) {
      this.visible = true
      axios({
        url: this.API1 + '/teacher/lesson-file-list.do',
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
// 导航部分
.userpart {
  margin-top: 20px;
  .leftnav {
    background-color: #fff;
    -webkit-box-shadow: 1px 1px 4px #c7c9c8;
    -moz-box-shadow: 1px 1px 4px #c7c9c8;
    box-shadow: 1px 1px 4px #c7c9c8;
    .admininfo {
      padding: 20px;
      height: 120px;
      position: relative;
      border-bottom: 1px solid #e5e5e5;
      .avatar {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        margin-right: 20px;
      }
      .action {
        position: absolute;
        bottom: 20px;
        left: 120px;
        .title {
          margin-bottom: 10px;
          margin-left: 10px;
        }
        .setbtn {
          height: 20px;
        }
      }
    }
  }
  .rightpart {
    padding-left: 20px;
  }
  .linkItem {
    padding: 10px 0 10px 20px;
    font-size: 16px;
  }
  .activelink {
    color: #ee3a43;
    background-color: #f2f2f2;
    border-left: 2px solid #ee3a43;
  }
}
.belongcourse {
  font-size: 12px;
  color: #888;
}
.onedate {
  margin-top: 15px;
  .lessontable {
    margin-top: 10px;
  }
}
</style>
