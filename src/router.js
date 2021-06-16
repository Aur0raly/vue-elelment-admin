import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/User/Users'
import Roles from '@/components/Jurisdiction/Roles'
import Rights from '@/components/Jurisdiction/Rights'
import Goods from '@/components/Goods/Goods'
import Params from '@/components/Goods/Params'
import Cate from '@/components/Goods/Cate'
import Orders from '@/components/Order/Orders'
import Reports from '@/components/Report/Reports'
import Add from '@/components/Goods/Add'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/roles', component: Roles },
      { path: '/rights', component: Rights },
      { path: '/goods', component: Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Cate },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports },
      { path: '/goods/add', component: Add }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
