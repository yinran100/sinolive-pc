import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/Home/Home'
import Store from '@/store/store'
import Login from '@/page/Login/Login'
import Mine from '@/page/Mine/Mine'
import Main from '@/page/Main/Main'

import MineInfo from '@/page/Mine/components/MineInfo'
import MineStudy from '@/page/Mine/components/MineStudy'
import TaskDetail from '@/page/Mine/components/TaskDetail'
import ModifyInfo from '@/page/Mine/components/ModifyInfo'
Vue.use(Router)


const router = new Router({
  routes: [{
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        index: 2,
        requireAuth: true // 进入这个路由是否需要登录
      }
    }, {
      path: '/main',
      name: 'main',
      component: Main,
      children: [{
        path: "taskdetail/:id",
        meta: {
          index: 6,
          requireAuth: true // 进入这个路由是否需要登录
        }, //meta对象的index用来定义当前路由的层级,越小越高
        component: TaskDetail
      }, {
        path: 'newspage/:id',
        name: 'newspage',
        component: () => import('@/page/NewsPage/NewsPage'),
        meta: {
          index: 4,
          requireAuth: true, // 进入这个路由是否需要登录
        }
      }, ]
    }, {
      path: '/mine',
      name: 'mine',
      component: Mine,
      redirect: "/mine/info",
      children: [{
        path: "info",
        meta: {
          index: 5,
          requireAuth: true // 进入这个路由是否需要登录
        }, //meta对象的index用来定义当前路由的层级,越小越高
        component: MineInfo
      }, {
        path: "modifyinfo",
        meta: {
          index: 5,
          requireAuth: true // 进入这个路由是否需要登录
        }, //meta对象的index用来定义当前路由的层级,越小越高
        component: ModifyInfo
      }, {
        path: "study",
        meta: {
          index: 5,
          requireAuth: true // 进入这个路由是否需要登录
        }, //meta对象的index用来定义当前路由的层级,越小越高
        component: MineStudy
      }]
    }, {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        index: 1,
        requireAuth: false // 进入这个路由是否需要登录
      }
    },
    {
      path: '/liveroom/:id',
      name: 'liveroom',
      component: () => import('@/page/LiveRoom/LiveRoom'),
      meta: {
        index: 3,
        requireAuth: true, // 进入这个路由是否需要登录
      }
    }, {
      path: '/answer/:id',
      name: 'answer',
      component: () => import('@/page/Answer/Answer'),
      meta: {
        index: 4,
        requireAuth: true, // 进入这个路由是否需要登录
      }
    }, {
      path: '/xyclottchart',
      name: 'xyclottchart',
      component: () => import('@/page/XYCLottChart/XYCLottChart'),
      meta: {
        index: 4,
        title: "幸运彩走势图",
        requireAuth: false, // 进入这个路由是否需要登录
      }
    }, {
      path: '*',
      redirect: "/",
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  } else document.title = '尊信培训'
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (Store.state.token == "") {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    } else next();
  } else {
    next();
  }
})
export default router;