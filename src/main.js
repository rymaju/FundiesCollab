import Vue from 'vue'
import App from './App'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(VueClipboard)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: () => import('./components/Home') },
    { path: '/room', component: () => import('./components/CreateRoom') },
    { path: '/room/:id', component: () => import('./components/Room') },
    { path: '*', component: () => import('./components/NotFound') }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
