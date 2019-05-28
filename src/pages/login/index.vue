<template>
  <div class="login">
    <header-nav :current="nowpage"></header-nav>
    <!-- <div class="topnav">
      <header-nav></header-nav>
    </div>-->
    <a-row type="flex" justify="center">
      <a-col :span="8">
        <div class="logininpart">
          <div class="type-part">
            <!-- <label for>账号：</label> -->
            <a-input type="text" v-model="form.username" placeholder="请输入账号" class="codeinput">
              <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
            </a-input>
          </div>
          <div class="type-part">
            <!-- <label for>密码：</label> -->
            <a-input type="password" v-model="form.password" placeholder="请输入密码" class="codeinput">
              <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
            </a-input>
          </div>
          <div class="type-part">
            <a-button @click="login" type="primary" class="loginbtn">登录</a-button>
          </div>
          <div class="type-part">
            <router-link to="/forgetpassword" class="linkcolor right">忘记密码?</router-link>
            <router-link to="/" class="linkcolor left">没有账号?马上注册</router-link>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'// 加载需要的模块
// s
import HeaderNav from '@/components/HeaderNav'// 加载组件
// import login from '@/untils/login'//加载方法
export default {
  components: {
    // HelloWorld: HelloWorld,
    HeaderNav: HeaderNav
  },
  data () {
    return {
      nowpage: ['setlogin'],
      form: {
        username: '',
        password: '',
        rememberMe: false
      },
      schools: []
    }
  },
  created () {
    this.$store.commit('handleUserName', {})
    localStorage.clear()
  },
  methods: {
    login: function () {
      axios({
        url: this.API1 + '/wxApp/login.do',
        method: 'post',
        headers: {
        },
        data: qs.stringify(this.form)
      })
        .then((res) => {
          if (res.data.err) {
            this.$message.error(res.data.err)
          } else {
            this.nextLogin(res.data)
            console.log(res.data)
          }
        })
    },
    nextLogin: function (logindata) {
      axios({
        url: this.API1 + '/login.php',
        method: 'post',
        headers: {
        },
        data: qs.stringify(this.form)
      }).then((res) => {
        logindata.successUrl = res.data.successUrl
        console.log(logindata)
        this.$store.commit('handleUserName', logindata)
        window.location.href = '/login.php'
        // if (logindata.successUrl === '/teacher/index.php') {
        //   this.$router.push({ name: 'teachertimeTable' })
        // } if (logindata.successUrl === '/open/stu-manager/index.php') {
        //   this.$router.push({ name: 'lessonList' })
        // }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  background: #ee3a43;
  padding-bottom: 30%;
  background: url(../../assets/loginbg1.jpg);
  background-size: cover;
}
input {
  width: 400px;
  padding: 10px;
}
.linkcolor {
  color: #ee3a43;
  font-size: 12px;
}
.right {
  float: right;
}
.logininpart {
  margin-top: 100px;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 50px;
  .type-part {
    margin-bottom: 15px;
  }
}
.codeinput {
  width: 100%;
}
.loginbtn {
  width: 100%;
}
</style>
