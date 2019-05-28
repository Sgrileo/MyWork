<template>
  <div>
    <a-row type="flex" justify="center" class="userpart">
      <a-col :span="18">
        <a-row>
          <a-col :span="6" class="leftnav">
            <div class="admininfo">
              <img src="../../assets/bgm.jpg" alt class="avatar">
              <div class="action">
                <div class="title">管理员</div>
                <div>
                  <a-button type="primary" class="setbtn">设置</a-button>
                </div>
              </div>
            </div>
            <div class="actionlink">
              <router-link to="/admin/timeTable">
                <div class="linkItem">课表管理</div>
              </router-link>
              <router-link to="/admin/courseList">
                <div class="linkItem activelink">课程管理</div>
              </router-link>
              <router-link to="/admin/orderManager">
                <div class="linkItem">订单管理</div>
              </router-link>
              <router-link to="/admin/schoolManager">
                <div class="linkItem">学校管理</div>
              </router-link>
              <router-link to="/admin/userManager">
                <div class="linkItem">用户管理</div>
              </router-link>
            </div>
          </a-col>
          <a-col :span="18" class="rightpart">
            <div class="datebox">
              <span>开课时间</span>
              <a-range-picker @change="selectDate"></a-range-picker>
              <span>是否上架</span>
              <a-select defaultValue="-1" @change="changeupload">
                <a-select-option value="-1">全部</a-select-option>
                <a-select-option value>未上架</a-select-option>
                <a-select-option value="0">下架</a-select-option>
                <a-select-option value="1">已上架</a-select-option>
                <a-select-option value="2">已上架所有课时</a-select-option>
              </a-select>
              <div class="chooseschool">
                <span>开课学校</span>
                <a-select defaultValue style="width:200px;" @change="selectschoold">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option
                    v-for="school in schools"
                    :value="school.schoolId"
                    :key="school.schoolId"
                  >{{school.name}}</a-select-option>
                </a-select>
                <a-select defaultValue @change="changeaccount">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option value="0">姓名</a-select-option>
                  <a-select-option value="1">账号</a-select-option>
                </a-select>
                <a-input class="accountinput" v-model="accountName"></a-input>
              </div>
              <div class="chooseschool">
                <a-input class="accountinput" placeholder="课程关键词" v-model="courseName"></a-input>
                <a-button type="primary" @click="getCourseList()">查询</a-button>
              </div>
            </div>
            <div class="courseitems">
              <a-row>
                <a-col :span="6" v-for="course in courseList" :key="course.courseId">
                  <router-link
                    :to="{path:'/student/mycoursedetail',query: {courseId: course.courseId}}"
                  >
                    <div class="courseblock">
                      <div class="courseimgpart">
                        <img
                          :src="course.img.length > 0 ? course.img :'https://www.ixyclass.com/styles/tupian.png'"
                          alt
                          class="courseImg"
                        >
                      </div>
                      <div class="courseText">
                        <div class="courseTit">{{course.courseName}}</div>
                        <div class="courseFree" v-if="course.stringPrice=='0.00'">公开课</div>
                        <div class="coursePrice" v-else>￥{{course.stringPrice}}</div>
                      </div>
                      <div class="courseInfo">
                        <span>{{course.courseTeacher}}</span>
                        <span class="peopleStudent">{{course.purchaseNum}}人在学</span>
                      </div>
                    </div>
                  </router-link>
                </a-col>
              </a-row>
            </div>
            <a-pagination
              v-model="pageIndex"
              :total="total"
              :defaultPageSize="16"
              @change="changepage"
              class="page"
            />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
import MyCourseBlock from '@/components/MyCourseBlock'
export default {
  components: {
    HeaderNav: HeaderNav,
    MyCourseBlock: MyCourseBlock
  },
  data () {
    return {
      coursestartTime: null,
      courseendTime: null,
      courseList: [],
      schools: [],
      novalue: '',
      schoolId: '',
      courseName: '',
      accountName: '',
      accountType: '',
      goodsStatus: -1,
      pageIndex: 1,
      total: 0
    }
  },
  created () {
    this.getschools()
    this.getCourseList()
  },
  methods: {
    selectDate: function (date, dateString) {
      console.log(date, dateString)
      this.courseStartTime = dateString[0] + ' 00:00:00'
      this.courseEndTime = dateString[1] + ' 23:59:59'
    //   this.gettimeTable()
    },
    getCourseList: function () {
      axios({
        url: this.API1 + '/open/admin/m-course-list.do',
        method: 'post',
        data: {
          courseStartTime: this.courseStartTime,
          courseEndTime: this.courseEndTime,
          pageIndex: this.pageIndex,
          pageSize: 16,
          courseName: this.courseName,
          roleType: '',
          schoolId: this.schoolId,
          accountName: this.accountName,
          accountType: this.accountType,
          goodsStatus: this.goodsStatus
        }
      }).then((res) => {
        this.courseList = res.data.rows
        this.total = res.data.total
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    getschools: function () {
      axios({
        url: this.API1 + '/open/admin/schools.do',
        method: 'post',
        data: {
          pageIndex: 1
        }
      }).then((res) => {
        this.schools = res.data.data
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    selectschoold: function (value) {
      this.schoolId = value
    },
    changeaccount: function (value) {
      this.accountType = value
    },
    changeupload: function (value) {
      this.goodsStatus = value
    },
    changepage: function (page, pageSize) {
      this.pageIndex = page
      this.getCourseList()
    }
  }
}
</script>
<style lang="less" scoped>
.courseblock {
  cursor: pointer;
  margin: 0 10px;
  margin-top: 20px;
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  &:hover {
    transform: translateY(-6px);
    -webkit-transform: translateY(-6px);
    -webkit-box-shadow: 1px 1px 4px #c7c9c8;
    -moz-box-shadow: 1px 1px 4px #c7c9c8;
    box-shadow: 1px 1px 4px #c7c9c8;
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
    .courseTit {
      color: #ee3a43;
    }
  }
}
.courseimgpart {
  width: 100%;
  height: 0;
  padding-top: 56%;
  overflow: hidden;
  border-radius: 4px;
  position: relative;
}
.courseImg {
  width: 100%;
  position: absolute;
  top: 0;
  transition: All 1s ease-in-out;
  &:hover {
    transform: scale(1.2);
    -webkit-transform: scale(1.2);
    -moz-transform: scale(1.2);
    -o-transform: scale(1.2);
    -ms-transform: scale(1.2);
  }
}
.courseText {
  padding: 5px;
}
.courseTit {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coursePrice {
  margin-top: 8px;
  font-size: 12px;
  color: #ee3a43;
}
.courseFree {
  color: #28b28b;
  font-size: 12px;
  margin-top: 8px;
}
.courseInfo {
  font-size: 12px;
  margin-top: 10px;
  color: #444;
}
.peopleStudent {
  float: right;
}
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
.datebox {
  background-color: #fff;
  padding: 10px;
}
.chooseschool {
  margin-top: 15px;
}
.accountinput {
  width: 200px;
}
.courseitems {
  margin-top: 20px;
}
.page {
  margin: 10px 0;
  margin-left: 10px;
}
</style>
