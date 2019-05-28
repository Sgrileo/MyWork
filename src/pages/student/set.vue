<template>
  <div class="courseList">
    <a-row type="flex" justify="center" class="actionNav">
      <a-col :span="18">
        <div class="btnPart">
          <router-link to="/student/lessonList">
            <a-button class="actionBtn">我的课表</a-button>
          </router-link>
          <router-link to="/student/courseList">
            <a-button class="actionBtn">我的课程</a-button>
          </router-link>
          <!-- <router-link to="/student/lessonList">
            <a-button class="actionBtn">我的订单</a-button>
          </router-link>-->
          <router-link to="/student/set">
            <a-button type="primary" class="actionBtn">个人设置</a-button>
          </router-link>
        </div>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center" class="courseBlocks">
      <a-col :span="18" class="setaction">
        <a-tabs>
          <a-tab-pane tab="个人设置" key="1">
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
            <p>Content of Tab Pane 1</p>
          </a-tab-pane>
          <a-tab-pane tab="修改密码" key="2">
            <div class="resetpassword">
              <a-form>
                <a-form-item label="旧密码" validate-status="success" help="请输入6~32由数字,字母组成字符;">
                  <a-input
                    placeholder="请输入旧密码"
                    v-model="oldpassword"
                    type="password"
                    class="setinput"
                  />
                </a-form-item>
                <a-form-item label="新密码" validate-status="success" help="请输入6~32由数字,字母组成字符;">
                  <a-alert message="请确保两次输入的新密码一致" banner v-show="showwaring"/>
                  <a-input
                    placeholder="请输入新密码"
                    v-model="newpassword"
                    type="password"
                    class="setinput"
                  />
                </a-form-item>
                <a-form-item label="新密码" validate-status="success" help="请输入6~32由数字,字母组成字符;">
                  <a-alert message="请确保两次输入的新密码一致" banner v-show="showwaring" class="setinput"/>
                  <a-input
                    placeholder="请再次输入新密码"
                    v-model="cnewpassword"
                    type="password"
                    @change="confirmpassword"
                  />
                </a-form-item>
              </a-form>
              <a-button type="primary" @click="resetpassword()">保存</a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="安全绑定" key="3">
            <div v-if="phonenum.length > 0 && step!=3" class="bindaction">您已经绑定手机号{{phonenum}}</div>
            <div v-if="(!phonenum || phonenum.length == 0) && step!=3" class="bindaction">
              你还没有绑定手机号
              <a-button type="primary" size="small" @click="step=3">立刻绑定</a-button>
            </div>
            <div v-if="step==3" class="bindaction">
              <div class="lineaction">
                <p>绑定手机</p>
                <a-input placeholder="请输入需要绑定的手机号" class="setinput" v-model="newphone"></a-input>
              </div>
              <div class="lineaction">
                <a-input
                  placeholder="请输入图形验证码"
                  class="setinput"
                  v-model="imgCode"
                  @change="piccodecheck"
                ></a-input>
                <img :src="codeimg" alt>
              </div>
              <div class="lineaction">
                <a-input placeholder="请输入手机收到的验证码" class="setinput" v-model="phonecode"></a-input>
                <a-button
                  type="primary"
                  :loading="iconLoading"
                  :disabled="ifsend"
                  @click="sendvrcode"
                >发送验证码</a-button>
              </div>
              <div class="lineaction">
                <a-button type="primary" @click="confirmphone">完成</a-button>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'// 加载需要的模块
import HeaderNav from '@/components/HeaderNav'
// import Footerr from '@/components/Footer'
import MyCourseBlock from '@/components/MyCourseBlock'
export default {
  name: 'courseList',
  components: {
    HeaderNav: HeaderNav,
    // Footerr: Footerr,
    MyCourseBlock: MyCourseBlock
  },
  data () {
    return {
      nowpage: ['index'],
      courseList: [],
      total: 0,
      pageIndex: 1,
      pageSize: 16,
      showwaring: false,
      oldpassword: '',
      newpassword: '',
      cnewpassword: '',
      fileList: [],
      newphone: '',
      iconLoading: false,
      imgCode: null,
      ifsend: true,
      phonecode: '',
      codeimg: 'https://www.ixyclass.com/img/code.php?t=0',
      phonenum: this.$store.state.userInfo.mobile,
      step: 1
    }
  },
  created () {
    // this.getlesson()
    // this.getmycourse()
  },
  methods: {
    piccodecheck: function () {
      if (this.imgCode.length === 4) {
        this.ifsend = false
      }
    },
    sendvrcode: function () {
      const data = {
        mobile: this.newphone,
        imgCode: this.imgCode
      }
      if (this.newphone.length === 11) {
        axios({
          url: this.API1 + '/sender/mobile-captcha.do',
          method: 'post',
          headers: {},
          data: qs.stringify(data)
        }).then((res) => {
          if (res.data.errorMessage) {
            this.$message.error(res.data.errorMessage)
          } else {
            this.iconLoading = true
            setTimeout(() => {
              this.iconLoading = false
            }, 60000)
          }
        })
      } else {
        this.$message.error('请输入正确的手机号')
      }
    },
    confirmphone: function () {
      axios({
        url: this.API1 + '/open/stu-manager/verify-mobile.do',
        method: 'post',
        headers: {},
        data: {
          code: this.phonecode,
          mobile: this.newphone
        }
      }).then((res) => {
        if (res.data.errorMessage) {
          this.$message.error(res.data.errorMessage)
        } else {
          this.$message.success('修改成功，重新登录后生效')
        }
      })
    },
    confirmpassword: function () {
      if (this.newpassword === this.cnewpassword) {
        this.showwaring = false
      } else {
        this.showwaring = true
      }
    },
    resetpassword: function () {
      if (this.newpassword === this.cnewpassword) {
        axios({
          url: this.API1 + '/open/stu-manager/edit-password.do',
          method: 'post',
          data: {
            password: this.oldpassword,
            newPassword: this.newpassword
          }
        }).then((res) => {
          if (res.data.errorMessage) {
            this.$message.error(res.data.errorMessage)
            this.oldpassword = ''
            this.newpassword = ''
            this.cnewpassword = ''
          } else {
            this.$message.success('修改成功')
            this.oldpassword = ''
            this.newpassword = ''
            this.cnewpassword = ''
          }
        })
      } else {
        this.showwaring = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
.setinput {
  width: 400px;
}
.lineaction {
  margin-bottom: 10px;
}
.actionNav {
  background-color: #fff;
  .btnPart {
    padding: 20px 10px;
    .actionBtn {
      border-radius: 16px;
      margin-right: 40px;
    }
  }
}
.setaction {
  background-color: #fff;
  margin-top: 20px;
}
.resetpassword {
  padding: 20px;
  padding-left: 60px;
}
.bindaction {
  padding: 20px;
}
</style>
