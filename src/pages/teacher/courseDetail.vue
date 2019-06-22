<template>
  <div class="lessonList">
    <a-row type="flex" justify="center" class="userpart">
      <a-col :span="18">
        <a-row>
          <a-col :span="6" class="leftnav">
            <div class="actionlink">
              <router-link to="/teacher/teachertimeTable">
                <div class="linkItem">我的课表</div>
              </router-link>
              <router-link to="/teacher/teachercourseList">
                <div class="linkItem activelink">我的课程</div>
              </router-link>
            </div>
          </a-col>
          <a-col :span="18" class="rightpart">
            <div class="courselist">
              <a-row class="detailpart">
                <a-col :span="8">
                  <div class="courseImg">
                    <img v-if="courseDetail.courseImg" :src="courseDetail.courseImg" alt>
                    <img v-if="!courseDetail.courseImg" :src="img" alt>
                  </div>
                </a-col>
                <a-col :span="12">
                  <div class="detailtext">
                    <div class="coursetitle">
                      {{courseDetail.courseName}}
                      <span class="total">共{{courseDetail.hourCount}}节</span>
                    </div>
                    <div class="othertext">
                      <p>老师:{{courseDetail.courseTeacher}}</p>
                      <p
                        v-if="courseDetail.startDateTime"
                      >上课时间:{{courseDetail.startDateTime.substring(0,10)}}--{{courseDetail.endDateTime.substring(0,10)}} 共{{courseDetail.courseCycle}}周</p>
                      <p v-if="!courseDetail.startDateTime">上课时间:从-到- 共--周</p>
                    </div>
                  </div>
                </a-col>
                <a-col :span="4">
                  <router-link
                    :to="{path:'/teacher/teachercourseedit',query: {courseId: courseId}}"
                  >
                    <a-button type="primary" class="actionbtn">编辑课程</a-button>
                  </router-link>
                  <!-- <a-button type="primary" class="actionbtn">学习数据</a-button> -->
                  <a-button type="primary" class="actionbtn" @click="showadd">添加课时</a-button>
                </a-col>
              </a-row>
              <a-tabs defaultActiveKey="1" class="infotable">
                <a-tab-pane tab="课时目录" key="1">
                  <a-table :columns="columns" :dataSource="lessonList" :pagination="false">
                    <div slot="name" slot-scope="text, record, index">
                      <div>第{{index+1}}节&nbsp;{{record.name}}</div>
                    </div>
                    <div slot="time" slot-scope="text, record, index">
                      <div>{{record.startTime.substring(0,16)}}--{{record.endTime.substring(11,16)}}</div>
                    </div>
                    <div slot="action" slot-scope="text, record, index">
                      <a
                        :href="'/clazz/play.php?lesson_id=' + record.id + '&courseid=' + record.courseId + '&title=' + record.name"
                        v-if="record.videoStatus==1 || record.videoStatus==4"
                      >
                        <a-button type="primary" size="small">查看录像</a-button>
                      </a>
                      <a
                        :href="'/clazz/login-clazz.php?lesson_id=' + record.id"
                        v-if="record.enterStatus>0 &&(record.videoStatus!=1 || record.videoStatus!=4)"
                      >
                        <a-button type="primary" size="small">进入课堂</a-button>
                      </a>
                      <a-upload
                        name="file"
                        accept=".flv"
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
                      <a-button type="primary" v-if="record.videoStatus==2" disabled>录像转码中</a-button>
                      <a-button type="primary" v-if="record.videoStatus==3" disabled>转码失败</a-button>
                    </div>
                    <div slot="ware" slot-scope="text, record, index">
                      <a :href="'/play/doc/index.html?id=' + record.id + '&title=' + record.name">
                        <a-button type="primary" size="small">管理课件</a-button>
                      </a>
                      <a-button
                        type="primary"
                        size="small"
                        v-if="record.hasCourseware"
                        @click="showdownload(record.id)"
                      >
                        <a-icon type="download"/>
                      </a-button>
                    </div>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane tab="课程简介" key="2">
                  <div class="courseintr" v-html="courseDetail.courseIntro"></div>
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
    <!-- 下载课件拟态窗口 -->
    <a-modal v-model="addvisible" title="添加课时" @ok="addlesson" okText="保存">
      <div class="lessoninfo">
        课时名称
        <a-input type="text" v-model="lessonName" placeholder="请输入课时名称" class="addinput"></a-input>
      </div>
      <div class="lessoninfo">
        上课时间
        <a-date-picker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="开始时间"
          @change="changelessonstartTime"
        />
      </div>
      <div class="lessoninfo">
        上课时长
        <a-input type="number" v-model="lessonLasttime" placeholder="请输入上课时长" class="addinput"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
import moment from 'moment'
// import Footerr from '@/components/Footer'
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
  title: '课时操作',
  key: 'actin',
  scopedSlots: { customRender: 'action' }
},
{
  title: '课件操作',
  key: 'ware',
  scopedSlots: { customRender: 'ware' }
}]
export default {
  name: 'lessonList',
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      img: require('../../assets/tupian.png'),
      nowpage: ['index'],
      courseDetail: {},
      columns: columns,
      lessonList: [],
      fileList: [],
      filelists: [],
      visible: false,
      addvisible: false,
      lessonName: '',
      lessonstartTime: '',
      lessonLasttime: 45,
      courseId: this.$route.query.courseId
    }
  },
  created () {
    this.getcourseDetail()
    this.getlessonList()
  },
  methods: {
    videoChange: function (info) {
      if (info.file.status === 'done') {
        this.$message.success('文件上传成功')
        this.getlessonList()
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败，请重试!')
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
    getcourseDetail: function () {
      axios({
        url: this.API1 + '/teacher/course-detail.do',
        method: 'post',
        data: {
          id: this.courseId
        }
      }).then((res) => {
        this.courseDetail = res.data.data
      })
    },
    getlessonList: function () {
      axios({
        url: this.API1 + '/teacher/course-lesson-list.do',
        method: 'post',
        data: {
          courseId: this.courseId,
          order: 'asc',
          pageIndex: 1,
          pageSize: 200
        }
      }).then((res) => {
        this.lessonList = res.data.rows
      })
    },
    changelessonstartTime: function (date, dateString) {
      this.lessonstartTime = dateString
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
      })
    },
    addlesson: function () {
      axios({
        url: this.API1 + '/teacher/insert-lesson.do',
        method: 'post',
        data: {
          courseId: this.courseId,
          startTime: this.lessonstartTime,
          fileIds: [],
          name: this.lessonName,
          endTime: moment(this.lessonstartTime).add(this.lessonLasttime, 'm').format('YYYY-MM-DD HH:mm:ss')
        }
      }).then((res) => {
        if (res.data.errorMessage) {
          this.$message.error(res.data.errorMessage)
        } else {
          this.addvisible = false
          this.$message.success('添加成功')
          this.getlessonList()
        }
      })
    },
    showadd: function () {
      this.addvisible = true
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
.itembox {
  margin-top: 10px;
  margin-right: 15px;
}
.courseitem {
  background-color: #fff;
  padding: 6px;
  .courseimg {
    width: 100%;
    height: 0;
    padding-top: 56%;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      position: absolute;
      top: 0;
    }
  }
  .coursetext {
    position: relative;
    padding-left: 5px;
    height: 100%;
  }
  .process {
    font-size: 12px;
    color: #888;
    position: absolute;
    bottom: 0;
  }
}
.detailpart {
  background-color: #fff;
  padding: 10px;
  .courseImg {
    width: 100%;
    height: 0;
    padding-top: 56%;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      position: absolute;
      top: 0;
    }
  }
  .detailtext {
    padding-left: 10px;
    position: relative;
    height: 100%;
    .coursetitle {
      padding-bottom: 35%;
    }
    .total {
      color: #888;
      font-size: 12px;
    }
    .othertext {
      position: absolute;
      bottom: 0;
      p {
        font-size: 12px;
        margin-bottom: 5px;
      }
    }
  }
}
.actionbtn {
  margin-bottom: 10px;
}
.infotable {
  background-color: #fff;
}
.addinput {
  width: 196px;
}
.lessoninfo {
  margin-top: 10px;
}
.courseintr {
  padding: 10px;
}
</style>
