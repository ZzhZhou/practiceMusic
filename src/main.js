import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/images/loading4.gif'),
  loading: require('./assets/images/loading4.gif'),
  attempt: 1,
  listenEvents: [ 'scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove' ]
})
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
(function(){ // 判断平台是移动端还是PC端（pc端只包含win）
  let  mobileAgent = ["iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire"];
  let browser = navigator.userAgent.toLowerCase();
  console.log(browser)
  for(let i=0;i<mobileAgent.length;i++){
    if(browser.indexOf(mobileAgent[i]) > -1){
      router.push({ path:'/myfound'});
      router.beforeEach((to, from, next) => { // 通过路有钩子获取路由名
        store.state.rName = to.name;
        next()
      })
      return
    }
    if(browser.indexOf('win') > -1){
      router.push({ path:'/pchome'});
      router.beforeEach((to, from, next) => { // 通过路有钩子获取路由名
        store.state.rName = to.name;
        next()
      })
      return
    }
  }
})()
