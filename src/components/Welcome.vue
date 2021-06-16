<template>
  <div>
    <div id="chart_line" style="width: 700px;height: 500px;"></div>
    <div id=""></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Welcome',
  data () {
    return {
      // value: new Date()
      option: {
        title: {
          text: '高考录取率'
        },
        xAxis: {
          type: 'category',
          data: ['2012', '2013', '2014', '2015', '2016', '2017', '2018']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          smooth: true
        }]
      }
    }
  },
  mounted () {
    // eslint-disable-next-line camelcase
    const chart_line = echarts.init(document.getElementById('chart_line'))
    const option = this.option
    option && chart_line.setOption(option)
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
