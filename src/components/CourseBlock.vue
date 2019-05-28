<template>
  <div class="courseblock">
    <!-- <img :src="course.coureseImg.length>0 ? course.courseImg : '' " alt class="courseImg"> -->
    <div class="courseimgpart">
      <img
        :src="course.courseImg.length > 0 ? course.courseImg :'https://www.ixyclass.com/styles/tupian.png'"
        alt
        class="courseImg"
      >
    </div>
    <div class="courseText">
      <div class="courseTit">{{course.courseName}}</div>
      <div class="courseFree" v-if="course.coursePrice=='0.00'">公开课</div>
      <div class="coursePrice" v-else>￥{{course.coursePrice}}</div>
      <!-- <div class="courseInfo">
        <span>{{course.courseTeacher}}</span>
        <span class="peopleStudent">{{course.purchaseNum}}人在学</span>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'CourseBlock',
  props: {
    course: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // current: ['indexs']
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
</style>
