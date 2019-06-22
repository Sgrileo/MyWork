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
                <div class="linkItem">我的课程</div>
              </router-link>
            </div>
          </a-col>
          <a-col :span="18" class="rightpart">
            <div class="setaction">
              <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="基本信息" key="1">
                  <div class="normalset">
                    <div>
                      <span>头像</span>
                      <a-avatar :src="nowavtor" alt class="userAvtar"></a-avatar>
                      <a-upload
                        :beforeUpload="beforeUploadimg"
                        @change="handleChange"
                        :showUploadList="false"
                      >
                        <a-button type="primary" size="small">编辑头像</a-button>
                      </a-upload>
                    </div>
                    <p>姓名:&nbsp;&nbsp;&nbsp;{{$store.state.userInfo.realname}}</p>
                    <p>账号:&nbsp;&nbsp;&nbsp;{{$store.state.userInfo.username}}</p>
                    <div>
                      性别:&nbsp;&nbsp;&nbsp;
                      <a-radio-group v-model="sex">
                        <a-radio :value="parseInt('1')">男</a-radio>
                        <a-radio :value="parseInt('2')">女</a-radio>
                      </a-radio-group>
                    </div>
                    <div>
                      <br>
                      <br>
                      <a-button type="primary" @click="set">保存</a-button>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane tab="密码修改" key="2" forceRender>
                  <div class="normalset">
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
                        <a-alert
                          message="请确保两次输入的新密码一致"
                          banner
                          v-show="showwaring"
                          class="setinput"
                        />
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
                  <div class="normalset">
                    <div v-if="phonenum">
                      <div
                        v-if="phonenum.length > 0 && step!=3"
                        class="bindaction"
                      >您已经绑定手机号{{phonenum}}</div>
                    </div>
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
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import axios from 'axios'
import qs from 'qs'
import HeaderNav from '@/components/HeaderNav'
// import Footerr from '@/components/Footer'
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
      nowpage: ['index'],
      courseList: [],
      img: require('../../assets/tupian.png'),
      sex: this.$store.state.userInfo.gender,
      nowavtor: 'https://img.ixyclass.com/' + this.$store.state.userInfo.avatar,
      showwaring: false,
      oldpassword: '',
      newpassword: '',
      cnewpassword: '',
      phonenum: this.$store.state.userInfo.mobile,
      phonecode: '',
      codeimg: 'https://www.ixyclass.com/img/code.php?t=0',
      step: 1,
      newphone: '',
      iconLoading: false,
      imgCode: null,
      ifsend: true
    }
  },
  created () {
    this.getcourseList()
    console.log(this.phonenum)
  },
  methods: {
    beforeUploadimg (file) {
      const isJPG = file.name.substring(file.name.length - 4, file.name.length).toLowerCase() === '.jpg' || '.png'
      if (!isJPG) {
        this.$message.error('请上传JPG或者PNG文件')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('文件请不要超过2M')
      }
      return isJPG && isLt2M
    },
    handleChange (info) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        this.nowavtor = imageUrl
      })
    },
    set: function () {
      axios({
        url: this.API1 + '/teacher/set.do',
        method: 'post',
        headers: {},
        data: {
          avatar: this.nowavtor,
          gender: this.sex
        }
      }).then((res) => {
        if (res.data.errorMessage) {
          this.$message.error(res.data.errorMessage)
        } else {
          this.$message.success('修改成功，重新登录后生效')
        }
      })
    },
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
        url: this.API1 + '/teacher/verify-mobile.do',
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
          url: this.API1 + '/teacher/edit-password.do',
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
    },
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
.setaction {
  background-color: #fff;
  -webkit-box-shadow: 1px 1px 4px #c7c9c8;
  -moz-box-shadow: 1px 1px 4px #c7c9c8;
  box-shadow: 1px 1px 4px #c7c9c8;
}
.normalset {
  padding: 16px;
}
.userAvtar {
  width: 100px;
  height: 100px;
  margin-left: 20px;
}
.bindaction {
  padding: 20px;
}
.setinput {
  width: 400px;
}
.lineaction {
  margin-bottom: 10px;
}
</style>
