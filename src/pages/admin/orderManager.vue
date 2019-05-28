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
                <div class="linkItem">课程管理</div>
              </router-link>
              <router-link to="/admin/orderManager">
                <div class="linkItem activelink">订单管理</div>
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
              <span>下单时间</span>
              <a-range-picker @change="selectDate"></a-range-picker>
              <span>支付方式</span>
              <a-select defaultValue @change="changepay" style="width:120px;">
                <a-select-option value>全部</a-select-option>
                <a-select-option value="1">麦豆支付</a-select-option>
                <a-select-option value="2">支付宝</a-select-option>
                <a-select-option value="4">PC微信</a-select-option>
                <a-select-option value="3">麦豆+支付宝</a-select-option>
                <a-select-option value="128">公众号支付</a-select-option>
                <a-select-option value="256">内部绑定</a-select-option>
              </a-select>
              <div class="chooseschool">
                <!-- <span>开课学校</span>
                <a-select defaultValue style="width:200px;" @change="selectschoold">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option
                    v-for="school in schools"
                    :value="school.schoolId"
                    :key="school.schoolId"
                  >{{school.name}}</a-select-option>
                </a-select>-->
                <a-select defaultValue="1" @change="changetype">
                  <a-select-option value>全部</a-select-option>
                  <a-select-option value="1">订单号</a-select-option>
                  <a-select-option value="2">课程ID</a-select-option>
                </a-select>
                <a-input class="accountinput" v-model="ocId"></a-input>
              </div>
              <div class="chooseschool">
                <a-input class="accountinput" placeholder="输入姓名" v-model="realname"></a-input>
                <a-input class="accountinput" placeholder="输入账号" v-model="username"></a-input>
                <a-button type="primary" @click="getorderList()">查询</a-button>
              </div>
            </div>
            <div class="courseitems">
              <a-table :columns="columns" :dataSource="orderList" :pagination="pagination">
                <div slot="name" slot-scope="record">
                  <div>{{record.oNo}}&nbsp;&nbsp;{{record.oPayTime}}</div>
                  <div>{{record.gName}}</div>
                </div>
                <div slot="account" slot-scope="record">
                  <div>{{record.uRealname}}</div>
                  <div>{{record.username}}</div>
                </div>
                <div slot="payChannel" slot-scope="record">
                  <div v-if="record.oPayChannel==1">麦豆支付</div>
                  <div v-if="record.oPayChannel==2">支付宝</div>
                  <div v-if="record.oPayChannel==4">PC微信</div>
                  <div v-if="record.oPayChannel==3">麦豆+支付宝</div>
                  <div v-if="record.oPayChannel==128">公众号支付</div>
                  <div v-if="record.oPayChannel==256">内部绑定</div>
                </div>
              </a-table>
              <a-pagination
                v-model="pageIndex"
                :total="total"
                :defaultPageSize="16"
                @change="changepage"
                class="page"
              />
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
  title: '商品名称/订单号',
  key: 'name',
  scopedSlots: { customRender: 'name' }
}, {
  title: '原价',
  dataIndex: 'str_gPrice',
  key: 'str_gPrice'
}, {
  title: '实付/折扣',
  scopedSlots: { customRender: 'discont' },
  key: 'discont'
}, {
  title: '姓名/账号',
  key: 'account',
  scopedSlots: { customRender: 'account' }
}, {
  title: '支付方式',
  key: 'PayChannel',
  scopedSlots: { customRender: 'payChannel' }
}
]
export default {
  components: {
    HeaderNav: HeaderNav
  },
  data () {
    return {
      pagination: false,
      startTime: null,
      endTime: null,
      orderList: [],
      payChannel: '',
      type: null,
      ocId: '',
      realname: '',
      username: '',
      pageIndex: 1,
      total: 0,
      columns
    }
  },
  created () {
  },
  methods: {
    selectDate: function (date, dateString) {
      console.log(date, dateString)
      this.startTime = dateString[0] + ' 00:00:00'
      this.endTime = dateString[1] + ' 23:59:59'
    //   this.gettimeTable()
    },
    getorderList: function () {
      axios({
        url: this.API1 + '/admin/sta/order-page.do',
        method: 'post',
        data: {
          startTime: this.startTime,
          endTime: this.endTime,
          pageIndex: this.pageIndex,
          pageSize: 16,
          type: this.type,
          ocId: this.ocId,
          payChannel: this.payChannel,
          realname: this.realname,
          username: this.username
        }
      }).then((res) => {
        this.orderList = res.data.rows
        this.total = res.data.total
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    changetype: function (value) {
      this.type = value
    },
    changepay: function (value) {
      this.payChannel = value
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
