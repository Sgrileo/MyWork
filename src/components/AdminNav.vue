<template>
  <div>
    <div class="admininfo">
      <img v-bind:src="avatar" alt class="avatar">
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
        <div class="linkItem">订单管理</div>
      </router-link>
      <router-link to="/admin/schoolManager">
        <div class="linkItem">学校管理</div>
      </router-link>
      <router-link to="/admin/userManager">
        <div class="linkItem">用户管理</div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  props: {
    avatar: {
      type: String, // 源码中的type
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      // current: ['index']
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
</style>
