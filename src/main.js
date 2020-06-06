import Vue from 'vue'
import App from './App'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'
import firebase from 'firebase'
import firebaseConfig from '../firebase.config'

firebase.initializeApp(firebaseConfig)

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(VueClipboard)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: () => import('./components/Home') },
    {
      path: '/room',
      component: () => import('./components/CreateRoom'),
      meta: { requiresAuth: true }
    },
    {
      path: '/room/:id',
      component: () => import('./components/Room'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      component: () => import('./components/Login'),
      meta: { requiresUnAuth: true }
    },
    {
      path: '/signup',
      component: () => import('./components/Signup'),
      meta: { requiresUnAuth: true }
    },
    { path: '*', component: () => import('./components/NotFound') }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresUnAuth = to.matched.some(record => record.meta.requiresUnAuth)
  const roomId = to.params.id
  if (requiresAuth && !currentUser) {
    if (roomId) {
      next(`/login?room=${roomId}`)
    } else {
      next('/login')
    }
  } else if (requiresUnAuth && currentUser) {
    next('/')
  } else {
    next()
  }
})

firebase.auth().onAuthStateChanged(() => {
  new Vue({
    render: h => h(App),
    router
  }).$mount('#app')
})
