<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover">
      <!-- 警告 -->
      <el-alert
        title="只允许为第三级分类设置相关参数!"
        :closable="false"
        show-icon
        type="warning">
      </el-alert>
      <!-- 选择分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            @change="handleChange"
            :props="cateProps"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加参数</el-button>
          <!-- 动态参数面板 -->
          <el-table :data="manyTableData" stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染 tag -->
                <el-tag closable effect="dark" v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 添加 newTag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="isBtnDisable" @click="addDialogVisible = true">添加属性</el-button>
          <!-- 静态参数面板 -->
          <el-table :data="onlyTableData" stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染 tag -->
                <el-tag closable effect="dark" v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{ item }}</el-tag>
                <!-- 添加 newTag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作" width="170">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">
                  编辑
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        @close="addDialogClose"
        width="30%">
        <el-form
          label-width="100px"
          :model="addForm"
          ref="addFormRef"
          :rules="addRules">
          <el-form-item
            prop="attr_name"
            :label="titleText">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        @close="editDialogClose"
        width="30%">
        <el-form
          label-width="100px"
          :model="editForm"
          ref="editFormRef"
          :rules="addRules">
          <el-form-item
            prop="attr_name"
            :label="titleText">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      cateList: [],
      cateProps: {
        expandTrigger: 'click',
        value: 'cat_id',
        // 指定选中的ID的名称
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器双向绑定
      selectedCateKeys: [],
      // 选择的 Tab 项
      activeName: 'many',
      // 动态参数对象
      manyTableData: [],
      // 静态参数对象
      onlyTableData: [],
      // 添加参数对话框控制
      addDialogVisible: false,
      // 修改参数对话框控制
      editDialogVisible: false,
      // 添加属性的数据对象
      addForm: {
        attr_name: ''
      },
      editForm: {},
      // 添加动态参数表单验证
      addRules: {
        attr_name: [
          {
            required: true,
            message: '请输入参数',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.cateList = res.data
    },
    handleChange () {
      // console.log(this.selectedCateKeys)
      // 判断是否为三级分类
      this.getParamChange()
    },
    // tab 标签点击处理函数
    handleClick () {
      // console.log(this.activeName)
      this.getParamChange()
    },
    async getParamChange () {
      if (this.selectedCateKeys.length !== 3) {
        this.$message.info('只允许选择三级分类！')
        // 清空选择
        this.selectedCateKeys = []
        // 选择错误清空表
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      // 将attr_vals转化为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        // 为每个渲染的 tag 设置单独属性
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      // 判断返回的参数类型，并赋值
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听添加参数对话框关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听编辑参数对话框关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // eslint-disable-next-line camelcase
    async showEditDialog (attr_id) {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败!')
      this.editForm = res.data
      this.editDialogVisible = true
      // 获取ID
      // console.log(attr_id)
    },
    // 删除对话框显示
    // eslint-disable-next-line camelcase
    async deleteParams (attr_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('以取消删除')
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      await this.getParamChange()
    },
    // 确认添加
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) return this.$message.error('创建失败')
        this.$message.success('创建成功')
        this.addDialogVisible = false
        // await this.getCateList()
        await this.getParamChange()
      })
    },
    // 编辑属性
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) return this.$message.error('更新数据失败！')
        this.$message.success('更新数据成功！')
        await this.getParamChange()
        // console.log(res)
      })
      this.editDialogVisible = false
    },
    // 失去焦点或按下 Enter
    async handleInputConfirm (row) {
      // 非合法重置为空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则执行后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      await this.saveAttrvals(row)
    },
    async saveAttrvals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('修改属性失败！')
      // console.log(res)
      this.$message.success('修改属性成功！')
    },
    showInput (row) {
      row.inputVisible = true
      // 输入框自动获得焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 移除 tag
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrvals(row)
    }
  },
  computed: {
    // 如果被禁用，返回true，否则返回false
    isBtnDisable () {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类ID
    cateId () {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    // 计算添加属性标题
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped lang="less">
.cat_opt {
  margin-top: 20px;
  margin-bottom: 20px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 200px;
}
</style>
