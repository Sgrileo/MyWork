<template>
  <div class="login">
    <header-nav :current="nowpage"></header-nav>
    <!-- <div class="topnav">
      <header-nav></header-nav>
    </div>-->
    <a-row type="flex" justify="center">
      <a-col :span="18">
        <div class="actionsteps">
          <a-steps :current="current">
            <a-step title="确认账号"/>
            <a-step title="安全验证"/>
            <a-step title="重置密码"/>
          </a-steps>
          <div class="stepaction Fstep" v-if="current==0">
            <p>请输入需要找回密码的账号</p>
            <a-input v-model="username" placeholder="请输入账号"></a-input>
          </div>
          <div class="stepaction Fstep" v-if="current==1">
            <p>您的手机号为{{thisuserinfo.mobile}}</p>
            <div class="codecheck">
              <a-input placeholder="请输入图形验证码" v-model="imgCode" @change="piccodecheck"></a-input>
              <img :src="piccode" alt>
            </div>
            <div class="codecheck">
              <a-input placeholder="请输入验证码" v-model="verifyCode"></a-input>
              <a-button
                type="primary"
                :loading="iconLoading"
                :disabled="ifsend"
                @click="sendcode"
              >发送验证码</a-button>
            </div>
          </div>
          <div class="stepaction Fstep" v-if="current==2">
            <div>
              <p>请输入新密码</p>
              <a-input v-model="newpassword" placeholder="输入新密码" type="password"></a-input>
              <p>请确认密码</p>
              <a-input v-model="confirmpassword" placeholder="再次确认输入新密码" type="password"></a-input>
            </div>
          </div>
          <div class="actionbtn">
            <a-button v-if="current>0" style="margin-left: 8px" @click="prev">上一步</a-button>
            <a-button v-if="current < 2" type="primary" @click="next">下一步</a-button>
            <a-button v-if="current == 2" type="primary" @click="changepass">完成</a-button>
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
      username: '',
      current: 0,
      schools: [],
      thisuserinfo: {},
      piccode: 'https://www.ixyclass.com/img/code.php?t=0',
      iconLoading: false,
      imgCode: null,
      ifsend: true,
      verifyCode: '',
      validSelfOpeCode: '',
      newpassword: '',
      confirmpassword: ''
    }
  },
  created () {
    this.$store.commit('handleUserName', {})
    localStorage.clear()
  },
  methods: {
    next: function () {
      if (this.current === 0) {
        axios({
          url: this.API1 + '/forget/confirm-username.do',
          method: 'post',
          headers: {},
          data: {username: this.username}
        })
          .then((res) => {
            if (res.data.errorMessage) {
              this.$message.error(res.data.errorMessage)
            } else {
              this.thisuserinfo = res.data
              this.current++
            }
          })
      } else if (this.current === 1) {
        if (this.verifyCode.length === 0) {
          this.$message.error('请输入验证码')
        } else {
          axios({
            url: this.API1 + '/forget/send-mobile-verify-code.do',
            method: 'post',
            headers: {},
            data: {
              mobile: this.thisuserinfo.mobile,
              userId: this.thisuserinfo.userId,
              verifyCode: this.verifyCode
            }
          }).then((res) => {
            if (res.data.errorMessage) {
              this.$message.error(res.data.errorMessage)
            } else {
              this.validSelfOpeCode = res.data.validSelfOpeCode
              this.current++
            }
          })
        }
      }
    },
    prev: function () {
      this.current--
    },
    changepass: function () {
      if (this.newpassword === this.confirmpassword) {
        axios({
          url: this.API1 + '/forget/update-password-by-forger.do',
          method: 'post',
          headers: {},
          data: {
            password: this.newpassword,
            userId: this.thisuserinfo.userId,
            validSelfOpeCode: this.validSelfOpeCode
          }
        }).then((res) => {
          if (res.data.errorMessage) {
            this.$message.error(res.data.errorMessage)
          } else {
            this.$message.success('修改成功')
            this.$router.push({ name: 'Login' })
          }
        })
      } else {
        this.$message.error('两次密码不一致，请重新输入')
        this.newpassword = ''
        this.confirmpassword = ''
      }
    },
    piccodecheck: function () {
      if (this.imgCode.length === 4) {
        this.ifsend = false
      }
    },
    sendcode: function () {
      const senddata = {
        mobile: this.thisuserinfo.mobile,
        imgCode: this.imgCode
      }
      axios({
        url: this.API1 + '/sender/mobile-captcha-forget-password.do',
        method: 'post',
        headers: {
        },
        data: qs.stringify(senddata)
      })
        .then((res) => {
          if (res.data.errorMessage) {
            this.$message.error(res.data.errorMessage)
          } else {
            this.iconLoading = true
            setTimeout(() => {
              this.iconLoading = false
            }, 60000)
          }
        })
    }
  }
}
</script>
<style lang="less" scoped>
input {
  width: 400px;
  padding: 10px;
}
.actionbtn {
  padding: 20px;
}
.codecheck {
  margin-top: 10px;
}
.logininpart {
  margin-top: 100px;
  border: 1px solid #f2f2f2;
  padding: 50px;
  .type-part {
    margin-bottom: 15px;
  }
}
.codeinput {
  width: 300px;
}
.loginbtn {
  width: 100%;
}
.actionsteps {
  margin-top: 40px;
  background-color: #fff;
  padding: 20px;
}
.stepaction {
  padding: 20px;
  margin-top: 20px;
}
</style>
