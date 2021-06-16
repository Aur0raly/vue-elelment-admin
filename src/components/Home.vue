<template>
  <!--  Home 组件-->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/images/avatar.svg" alt="">
        <span>高考志愿填报系统</span>
      </div>
      <el-button @click="quit" type="info">退出登录</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px':'230px'">
        <div class="toggle-button" @click="toggleCollapse" :collapse="isCollapse">
          <span class="el-icon-more"></span>
        </div>
        <el-menu background-color="#3c405f"
                 text-color="#fff"
                 active-text-color="#409feb"
                 unique-opened
                 :collapse-transition="false"
                 router
                 :collapse="isCollapse">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item @click="saveNavState('/' + subItem.path)"
                          :index="'/' + subItem.path"
                          v-for="subItem in item.children"
                          :default-active="activePath"
                          :key="subItem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      menuList: [],
      iconsObj: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-platform',
        101: 'el-icon-s-shop',
        102: 'el-icon-s-order',
        145: 'el-icon-s-release'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    quit () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('菜单列表获取失败')
      this.menuList = res.data
      console.log(res)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  height: 100%;
}

.el-header {
  background-color: #333033;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #FFF;
  font-size: 20px;
  font-weight: bold;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 20px;
    }
  }

  img {
    width: 80px;
    height: 80px;
  }
}

.el-aside {
  background-color: #3c405f;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #EAEDF1;
}

.toggle-button {
  background-color: #4A5064;
  color: #EEEEEE;
  font-size: 20px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
