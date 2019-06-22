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
            <div class="actionaddcourse">
              <router-link to="/teacher/addcourse">
                <a-button type="primary">添加课程</a-button>
              </router-link>
            </div>
            <div class="courselist">
              <a-row type="flex">
                <a-col :span="10" v-for="item in courseList" :key="item.courseId" class="itembox">
                  <router-link
                    :to="{path:'/teacher/teachercoursedetail',query: {courseId: item.courseId}}"
                  >
                    <div class="courseitem">
                      <a-row type="flex">
                        <a-col :span="12">
                          <div class="courseimg">
                            <img v-if="item.coverPic" :src="item.coverPic" alt>
                            <img v-if="!item.coverPic" :src="img" alt>
                          </div>
                        </a-col>
                        <a-col :span="12">
                          <div class="coursetext">
                            <div class="coursetitle">{{item.courseName}}</div>
                            <div class="process">进行至{{item.coverHour}}节,共{{item.countHour}}节</div>
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                  </router-link>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
// import Footerr from '@/components/Footer'
export default {
  name: 'lessonList',
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      nowpage: ['index'],
      courseList: [],
      img: require('../../assets/tupian.png')
    }
  },
  created () {
    this.getcourseList()
  },
  methods: {
    getcourseList: function () {
      axios({
        url: this.API1 + '/teacher/my-course-list.do',
        method: 'post',
        data: {
          pageIndex: 1,
          pageSize: 200
        }
      }).then((res) => {
        this.courseList = res.data.rows
        console.log(res.status)
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
    .coursetitle {
      padding-bottom: 40%;
    }
  }
  .process {
    font-size: 12px;
    color: #888;
    position: absolute;
    bottom: 0;
  }
}
</style>
