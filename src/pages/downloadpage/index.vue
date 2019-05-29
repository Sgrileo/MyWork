<template>
  <div class="download">
    <header-nav :current="nowpage"></header-nav>
    <!-- <div class="topnav">
      <header-nav></header-nav>
    </div>-->
    <a-row type="flex" justify="center" :style="{'min-height':boxheight}">
      <a-col :span="18">
        <div class="downcontent">
          <div class="qrpart">
            <img src="static/qrcode.jpg" alt>
            <div class="qrneed">扫一扫手机听课</div>
          </div>
          <p class="slogan">晓鹰云课堂</p>
          <p class="slogan">让你学习更快捷</p>
          <a-popover title="注意事项" trigger="hover" placement="right">
            <template slot="content">
              <p>目前仅支持Win7及以上用户,暂不支持MAC用户</p>
            </template>
            <a
              href="https://img.ixyclass.com/plugins/%E6%99%93%E9%B9%B0%E4%BA%91%E8%AF%BE%E5%A0%82.zip"
              class="downbtn"
            >下载客户端</a>
          </a-popover>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script>
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
      boxheight: document.documentElement.clientHeight + 'px',
      nowpage: ['download'],
      form: {
        username: '',
        password: '',
        rememberMe: false
      },
      schools: []
    }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.download {
  background: #ee3a43;
  background: url(../../assets/loginbg3.jpg);
  background-size: cover;
}
.slogan {
  font-size: 72px;
  margin-bottom: 0.3rem;
  color: #fff;
  font-weight: 600;
  text-shadow: #222 2px 4px 2px;
}
.downbtn {
  text-decoration: none;
  display: inline-block;
  color: #fff;
  background-color: #ee3a43;
  width: 20%;
  text-align: center;
  font-size: 20px;
  padding: 20px;
  margin-top: 20px;
}
.tips {
  background-color: #fff;
}
.downcontent {
  position: relative;
  margin-top: 100px;
  //   background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
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
.qrpart {
  position: absolute;
  right: 0;
  top: 30px;
  img {
    width: 200px;
  }
  .qrneed {
    background: #fff;
    color: #ee3a43;
    text-align: center;
    padding: 4px 0;
  }
}
</style>
