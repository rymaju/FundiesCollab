import Vue from 'vue'
import App from './App'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
import VueClipboard from 'vue-clipboard2'

import CreateRoom from './components/CreateRoom'
import Home from './components/Home'
import NotFound from './components/NotFound'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(VueClipboard)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/room', component: CreateRoom },
    { path: '/room/:id', component: () => import('./components/Room') },
    { path: '*', component: NotFound }
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
