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
            <div>创建新课程</div>
            <div class="normalinfo">
              <a-row>
                <a-col :span="8">
                  <div class="courseimg">
                    <img :src="courseimg ? courseimg : img" alt>
                  </div>
                  <div class="editimg">
                    <a-upload
                      :beforeUpload="beforeUploadimg"
                      @change="handleChange"
                      :showUploadList="false"
                    >
                      <a-button>编辑封面</a-button>
                    </a-upload>
                  </div>
                </a-col>
                <a-col :span="16">
                  <div class="textinfo">
                    <div class="editinfo">
                      <!-- <a-button size="small" @click="showgrade">选择</a-button> -->
                      <a-checkbox-group @change="gradechange">
                        <a-row v-for="item in gradeList" :key="item.id" class="graderow">
                          <a-col :span="4">{{item.name}}</a-col>
                          <a-col :span="18">
                            <a-checkbox
                              v-for="grade in item.childrens"
                              :key="grade.id"
                              :value="grade.id"
                              class="checkboxs"
                            >{{grade.name}}</a-checkbox>
                          </a-col>
                        </a-row>
                      </a-checkbox-group>
                    </div>
                    <div class="editinfo">
                      课程科目
                      <a-select
                        :defaultValue="novalue"
                        style="width:200px;"
                        @change="selectsubject"
                      >
                        <a-select-option :value="novalue">--</a-select-option>
                        <a-select-option
                          v-for="item in subjectIdList"
                          :value="item.id"
                          :key="item.id"
                        >{{item.name}}</a-select-option>
                      </a-select>
                    </div>
                    <div class="editinfo">
                      课程名称
                      <a-input style="width:200px;" v-model="courseName"></a-input>
                    </div>
                    <div class="editinfo">
                      是否录制
                      <a-radio-group v-model="ifrecord">
                        <a-radio :value="true">录制</a-radio>
                        <a-radio :value="false">不录制</a-radio>
                      </a-radio-group>
                    </div>
                    <div class="editinfo">
                      <a-button type="primary" @click="addcourse">保存</a-button>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <!-- 选择学段 -->
    <a-modal v-model="gradevisible" title="学段选择" onok :width="600">
      <a-checkbox-group @change="gradechange">
        <a-row v-for="item in gradeList" :key="item.id">
          <a-col :span="4">{{item.name}}</a-col>
          <a-col :span="20">
            <a-checkbox
              v-for="grade in item.childrens"
              :key="grade.id"
              :value="grade.id"
            >{{grade.name}}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
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

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'lessonList',
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      img: require('../../assets/tupian.png'),
      nowpage: ['index'],
      gradevisible: false,
      addvisible: false,
      lessonLasttime: 45,
      lessonstartTime: '',
      lessonName: '',
      courseimg: '',
      novalue: '',
      subjectId: '',
      subjectIdList: [],
      gradeList: [],
      chosegradeList: [],
      courseName: '',
      ifrecord: true
    }
  },
  created () {
    this.getcategorys()
  },
  methods: {
    showgrade: function () {
      this.gradevisible = true
    },
    beforeUpload: function (file) {
      const isflv = file.type === 'video/x-flv'
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
    handleChange (info) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.courseimg = imageUrl
        console.log(this.courseimg)
      })
    },
    beforeUploadimg (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('请上传JPG')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('文件请不要超过2M')
      }
      return isJPG && isLt2M
    },
    getcategorys: function () {
      axios({
        url: this.API1 + '/teacher/school-categorys.do',
        method: 'post',
        data: {
        }
      }).then((res) => {
        console.log(res.data.rows)
        for (var i = 0; i < res.data.rows.length; i++) {
          if (res.data.rows[i].name === '科目') {
            this.subjectIdList = res.data.rows[i].childrens
          }
          if (res.data.rows[i].name === '学段') {
            this.gradeList = res.data.rows[i].childrens
          }
        }
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
          endTime: moment(this.lessonstartTime).add(45, 'm').format('YYYY-MM-DD HH:mm:ss')
        }
      }).then((res) => {
        this.addvisible = false
        this.$message.success('添加成功')
        this.getlessonList()
      })
    },
    gradechange: function (checkedValues) {
      this.chosegradeList = checkedValues
      console.log(this.chosegradeList)
    },
    showadd: function () {
      this.addvisible = true
    },
    changelessonstartTime: function (date, dateString) {
      this.lessonstartTime = dateString
    },
    selectsubject: function (value) {
      this.subjectId = value
    },
    addcourse: function () {
      const category = this.chosegradeList
      category.push(this.subjectId)
      axios({
        url: this.API1 + '/teacher/course/first-add.do',
        method: 'post',
        data: {
          assistants: [],
          categoryIds: category,
          courseName: this.courseName,
          coverPic: this.courseimg,
          isRecord: this.ifrecord,
          teacherId: ''
        }
      }).then((res) => {
        this.$confirm({
          title: '提示',
          content: '课程创建成功，是否编辑课程简介以及添加课时信息?',
          onOk: () => {
            console.log(res.data.id)
            this.$router.push({path: '/teacher/teachercourseedit', query: {courseId: res.data.id}})
          },
          onCancel: () => {
            this.$router.push({path: '/teacher/teachercourseList'})
          }
        })
      }).catch((error) => {
        if (error.message === 'Network Error') {
          this.$confirm({
            title: '提示',
            content: '请求出错，请尝试重新登录',
            onOk: () => {
              this.$router.push({path: '/login'})
            },
            onCancel: () => {
              this.$router.push({path: '/'})
            }
          })
        }
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
    -webkit-transform: translateY(-6px);
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
.normalinfo {
  padding: 10px;
  margin-top: 15px;
  background: #fff;
  .textinfo {
    padding-left: 20px;
    .editinfo {
      margin-bottom: 10px;
    }
  }
}
.editimg {
  text-align: center;
  margin-top: 20px;
}
.checkboxs {
  margin-left: 0;
  margin-right: 8px;
}
.graderow {
  margin-bottom: 10px;
}
</style>
