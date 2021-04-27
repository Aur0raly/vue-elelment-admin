<template>
  <div>
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="item in 3" :key="item">
        <h3 class="medium">{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <div class="block">
      <el-timeline>
        <el-timeline-item timestamp="2021/4/24" placement="top">
          <el-card>
            <h4>完成 User 内容绘制</h4>
            <p>宋茂晨 提交于 2021/4/24 21:30</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2021/4/21" placement="top">
          <el-card>
            <h4>完成 Home 页面绘制</h4>
            <p>宋茂晨 提交于 2021/4/21 12:20</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2021/4/20" placement="top">
          <el-card>
            <h4>完成 Login 登录模块</h4>
            <p>宋茂晨 提交于 2021/4/20 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <!--    <el-calendar v-model="value"></el-calendar>-->
  </div>

</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      // value: new Date()
    }
  }
}
</script>

<style scoped lang="less">
.el-carousel__item h3 {
  color: #475669;
  font-size: 40px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
