<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类 -->
    <el-card class="box-card" shadow="hover">
      <!-- 添加分类 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 商品清单 -->
      <tree-table
        :data="catesList"
        :columns="columns"
        index-text="#"
        :selection-type="false"
        :tree-type="true"
        change-on-select
        :is-fold="true"
        :show-index="true"
        :expand-type="false"
        stripe>
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag type="success" effect="dark" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" effect="dark" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" effect="dark" v-else>三级</el-tag>
        </template>
        <template slot="operation">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editCateName">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 页码 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="this.queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total">
      </el-pagination>
    </el-card>
    <!-- 添加 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      @close="addCateDialogClose"
      width="30%">
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            change-on-select
            filterable
            clearable
            @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogClose">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      title="编辑分类"
      width="30%"
      @close="addCateDialogClose"
      :visible.sync="editCateDialogVisible">
      <el-form
        :model="editCateForm"
        ref="editCateFormRef"
        label-width="100px"
        :rules="addCateRules">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 查询参数
      queryInfo: {
        type: [1, 2, 3],
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类列表
      catesList: [],
      total: 0,
      // 为 table 指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '分类等级',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],
      // 控制添加用户弹窗
      addCateDialogVisible: false,
      // 编辑用户弹窗
      editCateDialogVisible: false,
      // 添加分类验证
      addCateRules: {
        cateName: [
          {
            required: true,
            message: '请输入分类名',
            trigger: 'blur'
          }
        ]
      },
      // 添加分类数据
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      editCateForm: {
      },
      parentCateList: [],
      // 联级选择器配置项
      cascaderProps: {
        expandTrigger: 'click',
        // 指定选中的ID
        value: 'cat_id',
        // 指定选中的ID的名称
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的数组
      selectedKeys: []
    }
  },
  created () {
    this.getCatesList()
  },
  methods: {
    async getCatesList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取商品分类列表失败')
      this.catesList = res.data.result
      this.total = res.data.total
      // console.log(res.data.total)
    },
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getCatesList()
    },
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCatesList()
    },
    // 监听添加分类显示
    showAddCateDialog () {
      this.addCateDialogVisible = true
      this.getParentCateList()
    },
    // 监听取消对话框显示
    addCateDialogClose () {
      this.addCateDialogVisible = false
      this.$refs.addCateFormRef.resetFields()
      // 退出时清空选择
      this.selectedKeys = {}
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
      this.$message.info('以取消添加分类')
    },
    // 获取父级分类数据
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取父级列表失败')
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChange () {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 给当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    addCate () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        await this.getCatesList()
        this.addCateDialogVisible = false
      })
    },
    // 编辑
    editCateName () {
      this.editCateDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">
.el-icon-success {
  color: #55a532;
}

.el-button {
  margin-bottom: 10px;
}

.el-icon-error {
  color: #bd2c00;
  text-align: center;
}

.el-cascader {
  width: 100%;
}
</style>
