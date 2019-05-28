<template>
  <div class="market">
    <header-nav :current="nowpage"></header-nav>
    <a-row type="flex" justify="center" class="chooseids">
      <a-col :span="18">
        <div class="chooseCondition">
          <label for>学校：</label>
          <a-select :defaultValue="novalue" style="width:200px;" @change="selectschoold">
            <a-select-option :value="novalue">全部</a-select-option>
            <a-select-option
              v-for="school in schools"
              :value="school.schoolId"
              :key="school.schoolId"
            >{{school.name}}</a-select-option>
          </a-select>
          <label for>科目：</label>
          <a-select :defaultValue="novalue" style="width:200px;" @change="selectsubjectld">
            <a-select-option :value="novalue">全部</a-select-option>
            <a-select-option
              v-for="item in subjectIdList"
              :value="item.id"
              :key="item.id"
            >{{item.name}}</a-select-option>
          </a-select>
          <a-input-search
            placeholder="请输入搜索关键字"
            style="width: 300px"
            class="keywordsearch"
            @search="keyword"
          />
        </div>
        <a-divider/>
        <div class="choosegrade">
          <label for>年级：</label>
          <div class="biggrade">
            <span
              class="gradeitem"
              :data-id="novalue"
              :class="gradeId==novalue ? 'actgrade' : ''"
              @click="choosegrade(novalue)"
            >全部</span>
          </div>
          <div v-for="biggrade in gradeList" :key="biggrade.id" class="biggrade">
            <span
              v-for="grade in biggrade.childrens"
              :key="grade.id"
              class="gradeitem"
              :data-id="grade.id"
              @click="choosegrade(grade.id)"
              :class="gradeId==grade.id ? 'actgrade' : ''"
            >{{grade.name}}</span>
          </div>
        </div>
      </a-col>
    </a-row>
    <div>
      <a-row type="flex" justify="center">
        <a-col :span="18">
          <div class="nocourse" v-if="goodList.length == 0">
            <a-icon type="info-circle"/>没有查询到相关数据哦~
          </div>
          <a-row class="courses">
            <a-col :span="6" v-for="item in goodList" :key="item.courseId">
              <router-link :to="{path:'/courseDetail',query: {courseId: item.courseId}}">
                <course-block :course="item"></course-block>
              </router-link>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <div class="pagePart" v-if="total!=0">
      <a-row type="flex" justify="center">
        <a-col :span="18">
          <a-pagination
            v-model="pageIndex"
            :total="total"
            :defaultPageSize="pageSize"
            @change="changepage"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import HeaderNav from '@/components/HeaderNav'
import CourseBlock from '@/components/CourseBlock'
import Footerr from '@/components/Footer'
export default {
  components: {
    HeaderNav: HeaderNav,
    Footerr: Footerr,
    CourseBlock: CourseBlock
  },
  data () {
    return {
      nowpage: ['market'],
      banners: [],
      goodList: [],
      schools: [],
      total: 0,
      novalue: '',
      schoolId: '',
      pageIndex: 1,
      pageSize: 16,
      subjectId: '',
      subjectIdList: [],
      gradeList: [],
      courseName: '',
      gradeId: ''
    }
  },
  created () {
    this.getschools()
    this.getcourse()
    this.getcategorys()
  },
  methods: {
    getbanners: function () {
      axios({
        url: this.API1 + '/open/market/banner-list.do',
        method: 'post',
        data: {}
      }).then((res) => {
        this.banners = res.data
        console.log(this.banners)
      })
    },
    getcourse: function () {
      const cate = []
      // cate.push(this.subjectId)
      if (this.subjectId.length > 0) {
        cate.push(this.subjectId)
      }
      if (this.gradeId.length > 0) {
        cate.push(this.gradeId)
      }
      axios({
        url: this.API1 + '/open/market/goods-list.do',
        method: 'post',
        data: {
          categoryIds: cate,
          courseName: this.courseName,
          freeStatus: 1,
          pageIndex: this.pageIndex,
          pageSize: 16,
          schoolId: this.schoolId,
          sortStatus: '1'
        }
      }).then((res) => {
        console.log(res.data.rows)
        this.goodList = res.data.rows
        this.total = res.data.total
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    getschools: function () {
      axios({
        url: this.API1 + '/open/market/schools.do',
        method: 'post',
        data: {}
      }).then((res) => {
        console.log(res.data.rows)
        this.schools = res.data.rows
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    getcategorys: function () {
      axios({
        url: this.API1 + '/open/market/categorys.do',
        method: 'post',
        data: {
          schoolId: this.schoolId
        }
      }).then((res) => {
        for (var i in res.data.rows) {
          if (res.data.rows[i].name === '科目') {
            this.subjectIdList = res.data.rows[i].childrens
          } else {
            this.gradeList = res.data.rows[i].childrens
          }
        }
      }).catch((res) => {
        // this.showConfirm()
      })
    },
    keyword: function (value) {
      this.courseName = value
      this.getcourse()
    },
    changepage: function (page, pageSize) {
      this.pageIndex = page
      this.getcourse()
    },
    selectschoold: function (value) {
      this.schoolId = value
      this.getcourse()
    },
    selectsubjectld: function (value) {
      this.subjectId = value
      this.getcourse()
    },
    choosegrade: function (id) {
      this.gradeId = id
      this.getcourse()
    }
  }
}
</script>
<style lang="less" scoped>
.nocourse {
  padding: 40px 0;
  text-align: center;
  color: #333;
}
.courses {
  margin-left: -10px;
}
.gradeitem {
  padding: 5px;
  cursor: pointer;
  margin-right: 10px;
}
.pagePart {
  margin: 20px 0;
}
.chooseids {
  background-color: #fff;
}
.biggrade {
  display: inline-block;
}
.chooseCondition {
  padding-top: 20px;
  background-color: #fff;
  label {
    margin-right: 15px;
  }
}
.keywordsearch {
  float: right;
}
.choosegrade {
  padding-bottom: 20px;
}
.actgrade {
  color: #fff;
  background-color: #ee3a43;
}
</style>
