import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Wellcome from '../components/Wellcome.vue'
import Users from '../components/users/user.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {path: '/', redirect: 'Login'},

  {path: '/home',name: 'Home', 
    component: Home, 
    redirect: '/wellcome',
    children:[
      {path: '/wellcome',component: Wellcome},
      {path: '/011',component:Users}
    ]},
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个跳转而来
  // next 是一个函数，放行还是强行跳转
  if (to.path == '/login') return next();
  //获取token
  const token = window.sessionStorage.getItem('token')
  // 如果没有token 跳转到登录
  if (!token) return next('/login')
  //放行
  next()
})

// 项目能运行，但是会报Avoid redundant navigation 的问题解决
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default router
