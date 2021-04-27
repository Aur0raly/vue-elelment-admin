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
import Categories from '@/components/Goods/Categories'
import Orders from '@/components/Order/Orders'
import Reports from '@/components/Report/Reports'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: Login,
    component: Login
  },
  {
    path: '/home',
    name: Home,
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: Welcome, component: Welcome },
      { path: '/users', name: Users, component: Users },
      { path: '/roles', name: Roles, component: Roles },
      { path: '/rights', name: Rights, component: Rights },
      { path: '/goods', name: Goods, component: Goods },
      { path: '/params', name: Params, component: Params },
      { path: '/categories', name: Categories, component: Categories },
      { path: '/orders', name: Orders, component: Orders },
      { path: '/reports', name: Reports, component: Reports }
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
