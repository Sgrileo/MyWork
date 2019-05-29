import Vue from 'vue'
import Router from 'vue-router'
import 'ant-design-vue/dist/antd.less'
import Antd from 'ant-design-vue'
import store from '../store'
// import HelloWorld from '@/components/HelloWorld'
// import HeaderNav from '@/components/HeaderNav'
import Login from '@/pages/login'
import ForgetPassword from '@/pages/forgetpass'
import RealIndex from '@/pages/realindex'
import Market from '@/pages/market'
import coursedetail from '@/pages/coursedetail'
import download from '@/pages/downloadpage'
// 学生页面
import student from '@/pages/student/index.vue'
import LessonList from '@/pages/student/lessonList.vue'
import CourseList from '@/pages/student/courseList.vue'
import MyCourseDetail from '@/pages/student/courseDetail.vue'
import StudentSet from '@/pages/student/set.vue'
// 管理员页面
import admin from '@/pages/admin/index.vue'
import timeTable from '@/pages/admin/timeTable.vue'
import adminCourseList from '@/pages/admin/courseList.vue'
import adminCourseDetail from '@/pages/admin/coursedetail.vue'
import adminorderManager from '@/pages/admin/orderManager.vue'
import schoolManager from '@/pages/admin/schoolManager.vue'
import userManager from '@/pages/admin/userManager.vue'
// 老师页面
import teacher from '@/pages/teacher/index.vue'
import teachertimeTable from '@/pages/teacher/lessonList.vue'
import teachercourselist from '@/pages/teacher/courseList.vue'
import teachercoursedetail from '@/pages/teacher/courseDetail.vue'
import teachercourseedit from '@/pages/teacher/courseEdit.vue'
import teacheraddcourse from '@/pages/teacher/addCourse.vue'

Vue.use(Router)
Vue.use(Antd)

export default new Router({
  // mode: 'history', // 可以去掉哈希
  routes: [{
    path: '/login', // 命名为要用杠开头
    name: 'Login', // 首字母大写,驼峰
    component: Login
  },
  {
    path: '/',
    name: 'RealIndex',
    component: RealIndex
  },
  {
    path: '/courseDetail',
    name: 'courseDetail',
    component: coursedetail
  },
  {
    path: '/market',
    name: 'Market',
    component: Market,
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/download',
    name: 'download',
    component: download,
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/forgetpassword',
    name: 'forgetpassword',
    component: ForgetPassword,
    beforeEnter: (to, from, next) => {
      next()
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: admin,
    beforeEnter: (to, from, next) => {
      next()
    },
    children: [{
      path: 'timeTable',
      name: 'timeTable',
      component: timeTable,
      beforeEnter: (to, from, next) => {
        console.log('进入课表管理')
        next()
      }
    },
    {
      path: 'courseList',
      name: 'courseList',
      component: adminCourseList,
      beforeEnter: (to, from, next) => {
        console.log('进入课程管理')
        next()
      }
    },
    {
      path: 'coursedetail',
      name: 'coursedetail',
      component: adminCourseDetail,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情管理')
        next()
      }
    },
    {
      path: 'orderManager',
      name: 'orderManager',
      component: adminorderManager,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情管理')
        next()
      }
    },
    {
      path: 'schoolManager',
      name: 'schoolManager',
      component: schoolManager,
      beforeEnter: (to, from, next) => {
        console.log('进入学校管理')
        next()
      }
    },
    {
      path: 'userManager',
      name: 'userManager',
      component: userManager,
      beforeEnter: (to, from, next) => {
        console.log('进入用户管理')
        next()
      }
    }
    ]
  },
  {
    path: '/student',
    name: 'student',
    component: student,
    beforeEnter: (to, from, next) => {
      if (store.state.userInfo.roleType === 1) {
        next()
      } else {
        alert(46546)
        next('/login')
      }
    },
    children: [{
      path: 'lessonList',
      name: 'lessonList',
      component: LessonList,
      beforeEnter: (to, from, next) => {
        next()
      }
    },
    {
      path: 'courseList',
      name: 'scourseList',
      component: CourseList,
      beforeEnter: (to, from, next) => {
        console.log('进入课程页面')
        next()
      }
    },
    {
      path: 'mycoursedetail',
      name: 'mycoursedetail',
      component: MyCourseDetail,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情')
        next()
      }
    },
    {
      path: 'set',
      name: 'set',
      component: StudentSet,
      beforeEnter: (to, from, next) => {
        console.log('进入设置')
        next()
      }
    }
    ]
  },
  {
    path: '/teacher',
    name: 'teacher',
    component: teacher,
    beforeEnter: (to, from, next) => {
      next()
    },
    children: [{
      path: 'teachertimeTable',
      name: 'teachertimeTable',
      component: teachertimeTable,
      beforeEnter: (to, from, next) => {
        console.log('进入课表管理')
        next()
      }
    },
    {
      path: 'teachercourseList',
      name: 'teachercourseList',
      component: teachercourselist,
      beforeEnter: (to, from, next) => {
        console.log('进入课程管理')
        next()
      }
    },
    {
      path: 'teachercoursedetail',
      name: 'teachercoursedetail',
      component: teachercoursedetail,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情管理')
        next()
      }
    },
    {
      path: 'teachercourseedit',
      name: 'teachercourseedit',
      component: teachercourseedit,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情管理')
        next()
      }
    },
    {
      path: 'addcourse',
      name: 'addcourse',
      component: teacheraddcourse,
      beforeEnter: (to, from, next) => {
        console.log('进入课程详情管理')
        next()
      }
    }
    ]
  }
  ]
})
