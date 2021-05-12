<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <el-row :gutter="50">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrdersList">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="150px"></el-table-column>
        <el-table-column label="是否付款" width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '0'" effect="dark" type="danger">未付款</el-tag>
            <el-tag v-else effect="dark" type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="150px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="300px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editPosition"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="editProgress"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog
        title="修改地址"
        :visible.sync="editPositionDialogVisible"
        @close="editPositionDialogClose"
        width="50%">
        <el-form label-width="100px"
                 ref="editFormRef"
                 :rules="editRules"
                 :model="editForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader
              v-model="editForm.address1"
              @change="handleChange"
              :options="cityData"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editPositionDialogClose">取 消</el-button>
          <el-button type="primary" @click="editPositionForm">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="物流进度"
        :visible.sync="editProgressDialogVisible"
        width="50%">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import cityData from '@/components/Order/citydata'

export default {
  name: 'Orders',
  data () {
    return {
      // 订单数据列表
      orderList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 控制修改对话框
      editPositionDialogVisible: false,
      editProgressDialogVisible: false,
      editForm: {},
      editRules: {
        address1: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressInfo: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 修改地址
    editPosition () {
      this.editPositionDialogVisible = true
    },
    // 地址
    editProgress () {
      const { data: res } = this.$http.get('/kuaidi/804909574412544580')
      console.log(res)
      // if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
      this.progressInfo = res.data
      console.log(this.progressInfo)
      this.editProgressDialogVisible = true
    },
    // 确定提交
    editPositionForm () {
      this.editPositionDialogVisible = false
    },
    // 级联选择器发生变化触发
    handleChange () {},
    // 关闭修改位置
    editPositionDialogClose () {
      this.$refs.editFormRef.resetFields()
      this.editPositionDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.el-cascader {
  width: 100%;
}
</style>
