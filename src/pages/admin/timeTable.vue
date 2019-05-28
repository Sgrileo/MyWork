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
                <div class="linkItem activelink">课表管理</div>
              </router-link>
              <router-link to="/admin/courseList">
                <div class="linkItem">课程管理</div>
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
              <a-range-picker @change="selectDate"></a-range-picker>
              <!-- <a-button type="primary">查询</a-button> -->
              <span>Tips：默认显示今日课表</span>
            </div>
            <div class="lessonitems">
              <a-table :columns="columns" :dataSource="timeTable">
                <div slot="name" slot-scope="record">
                  <div>
                    <router-link to="/" class="lessonlink">{{record.name}}</router-link>
                    <router-link to="/" class="courseware" v-if="record.hasCourseware">课件</router-link>
                  </div>
                  <div class="coursename">{{record.courseName}}</div>
                </div>
                <div
                  slot="time"
                  slot-scope="record"
                  class="lessontime"
                >{{record.startTime.substring(0,16)}}-{{record.stringEndTime}}</div>
              </a-table>
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
const columns = [{
  title: '课程名称',
  key: 'name',
  // slots: { title: 'customTitle' },
  scopedSlots: { customRender: 'name' }
}, {
  title: '上课老师',
  dataIndex: 'teacherName',
  key: 'teacherName'
}, {
  title: '相关学校',
  dataIndex: 'schoolName',
  key: 'schoolName'
}, {
  title: '上课时间',
  key: 'tags',
  scopedSlots: { customRender: 'time' }
}]
export default {
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      startTime: this.dateformat(new Date().toLocaleDateString()) + ' 00:00:00',
      endTime: this.dateformat(new Date().toLocaleDateString()) + ' 23:59:59',
      timeTable: [],
      columns
    }
  },
  created () {
    this.gettimeTable()
  },
  methods: {
    dateformat: function (time) {
      var date = new Date(time)
      var year = date.getFullYear()
      var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return year + '-' + month + '-' + day
    },
    selectDate: function (date, dateString) {
      console.log(date, dateString)
      this.startTime = dateString[0] + ' 00:00:00'
      this.endTime = dateString[1] + ' 23:59:59'
      this.gettimeTable()
    },
    gettimeTable: function () {
      axios({
        url: this.API1 + '/open/admin/find-lesson-list.do',
        method: 'post',
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          pageIndex: 1,
          pageSize: 256
        }
      }).then((res) => {
        this.timeTable = res.data.rows
      }).catch((res) => {
        // this.showConfirm()
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
  padding: 10px 20px;
  background: #fff;
}
.lessonitems {
  margin-top: 15px;
  background-color: #fff;
}
.tablepad {
  padding: 5px;
}
.lessontable {
  width: 100%;
  th {
    padding: 15px;
  }
  td {
    padding: 10px;
    padding-left: 15px;
  }
}
.coursename {
  font-size: 12px;
  color: #797979;
}
.lessonlink {
  color: #ee3a43;
}
.courseware {
  line-height: 1;
  font-size: 12px;
  padding: 0 2px;
  color: #ee3a43;
  border: 1px solid #ee3a43;
}
.lessontime {
  font-size: 12px;
  color: #797979;
}
</style>
