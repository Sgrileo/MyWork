<template>
  <a-affix :offsetTop="0">
    <div class="head-nav">
      <a-row style="background:#fff;" type="flex" justify="center">
        <a-col :span="4">
          <router-link to="/">
            <img src="../assets/nav-newlogo.png" alt class="nav-logo">
          </router-link>
        </a-col>
        <a-col :span="5">
          <a-menu mode="horizontal" v-model="current">
            <a-menu-item key="index">
              <router-link to="/">主页</router-link>
            </a-menu-item>
            <a-menu-item key="market">
              <router-link to="/market">课程中心</router-link>
            </a-menu-item>
            <a-menu-item key="download">
              <router-link to="/download">客户端</router-link>
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="9" class="setlogin">
          <div v-show="!$store.state.userInfo.realname" class="avatarpart">
            <router-link to="/login">
              <a-button type="primary">登录</a-button>
            </router-link>
            <a-button>注册</a-button>
          </div>
          <div v-show="$store.state.userInfo.realname" class="avatarpart">
            <template v-show="$store.state.userInfo.roleType ==1">
              <a-dropdown>
                <a href class="ant-dropdown-link">
                  <a href="/login.php">
                    <a-avatar :src="'https://img.ixyclass.com/' + $store.state.userInfo.avatar"></a-avatar>
                    <span>{{$store.state.userInfo.realname}}</span>
                  </a>
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <router-link to="/login">退出账号</router-link>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </div>
          <div class="contantpart">
            <span>
              <a
                href="http://wpa.qq.com/msgrd?v=3&uin=3014497252&site=qq&menu=yes"
                target="blank"
                title="点击联系在线客服"
                style="color:#666"
              >
                在线客服:
                <a-icon type="qq" style="font-size:20px; color:#666"/>
              </a>
            </span>
            <span class="phonenum">
              <a-icon type="phone"/>180-5871-4816
              <span class="time">(每日07:30--21:00)</span>
            </span>
          </div>
        </a-col>
      </a-row>
    </div>
  </a-affix>
</template>
<script>
export default {
  name: 'Header',
  props: {
    current: {
      type: Array, // 源码中的type
      default () {
        return ['index']
      }
    }
  },
  data () {
    return {
      link: '',
      roleType: this.$store.state.userInfo.roleType
    }
  },
  created () {
    if (this.$store.state.userInfo.roleType === 1) {
      this.link = '/student/lessonList'
    }
    if (this.$store.state.userInfo.roleType === 1) {
      this.link = '/student/lessonList'
    }
  }
}
</script>
<style lang="less" scoped>
.head-nav {
  border-bottom: 1px solid #e8e8e8;
  box-shadow: 0 0 5px #888;
  .ant-menu-horizontal {
    border: none;
  }
}
.setlogin {
  -webkit-box-shadow: none;
  box-shadow: none;
  line-height: 46px;
  white-space: nowrap;
}
.nav-logo {
  // height:80%;
  width: 100%;
}
.avatarpart {
  float: right;
}
.phonenum {
  font-size: 16px;
}
.time {
  font-size: 10px;
}
.contantpart {
  float: right;
  font-size: 14px;
  color: #666;
}
</style>
