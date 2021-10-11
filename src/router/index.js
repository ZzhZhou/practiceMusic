import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/pchome',
    name: 'PcHome',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../components/pcComponents/PcHome.vue')
  },
  {
    path: '/apphome',
    name: 'AppHome',
    component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/AppHome.vue'),
    children: [
      {
        path: '/myfound',
        name: 'MyFound',
        component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/homeChildPage/MyFound.vue')
      },
      {
        path: '/ispodcast',
        name: 'IsPodcast',
        component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/homeChildPage/IsPodcast.vue')
      },
      {
        path: '/mymusic',
        name: 'MyMusic',
        component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/homeChildPage/MyMusic.vue')
      },
      {
        path: '/ksong',
        name: 'Ksong',
        component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/homeChildPage/KsongPage.vue')
      },
      {
        path: '/cloudvillage',
        name: 'CloudVillage',
        component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/homeChildPage/CloudVillage.vue')
      },
      // {
      //   path: '/moresheet',
      //   name: 'MoreSheet',
      //   component: () => import(/* webpackChunkName: "about" */ '../components/appComponents/songSheet/MoreSheet.vue')
      // },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
