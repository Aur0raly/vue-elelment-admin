<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card" shadow="hover">
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 渲染角色列表 -->
      <el-table :data="rolesList" stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" class="center"
                    :class="['bdbottom',i1 === 0 ? 'bdtop' : '']">
              <el-col :span="5">
                <el-tag type="primary" closable @close="removeRightById(scope.row, item1.id)">{{
                    item1.authName
                  }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2 === 0 ? 'center' : 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning"
                            closable
                            v-for="(item3) in item2.children"
                            @close="removeRightById(scope.row, item3.id)"
                            :key="item3.id">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-share" size="mini" @click="showSetRightList(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" width="30%" :visible.sync="setDialogVisible" @close="setRightListClose">
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id"
               :default-checked-keys="defKeys" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 获取的角色列表
      rolesList: [],
      // 控制分配角色对话框
      setDialogVisible: false,
      rightsList: [],
      // 树形控件数据
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败')
      this.rolesList = res.data
    },
    // 添加角色
    addRole () {
    },
    // 移除角色
    async removeRightById (role, rightId) {
      const confrimResult = await this.$confirm('此操作将删除角色权限，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => err)
      if (confrimResult !== 'confirm') return this.$message.info('以取消删除操作')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除角色权限失败')
      // await this.getRolesList()
      role.children = res.data
    },
    // 角色权限分配列表
    async showSetRightList (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
      this.rightsList = res.data
      // 递归获取所有三级节点
      this.getLeafKeys(role, this.defKeys)
      this.setDialogVisible = true
    },
    // 通过递归的形式，获取角色权限数据(三级权限)
    getLeafKeys (node, arr) {
      // 如果node节点不包含 children 属性，则是三级节点
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭分配角色对话框时清空所有数据
    setRightListClose () {
      this.defKeys = []
    },
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('分配角色权限失败')
      this.$message.success('分配角色权限成功')
      await this.getRolesList()
      this.setDialogVisible = false
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #EEE;
}

.center {
  display: flex;
  align-items: center;
}

.bdbottom {
  border-bottom: 1px solid #EEE;
}
</style>
