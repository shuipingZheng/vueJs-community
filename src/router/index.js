import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/'
import message from '@/pages/message'
import person from '@/pages/person'
import settings from '@/pages/settings'
import articlePage from '@/pages/articlePage'
import login from '@/pages/login'
import add from '@/pages/add'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'index'
    },{
      path: '/index',
      name: 'index',
      component: index
    },{
      path: '/message',
      name: 'message',
      component: message
    },{
      path: '/person',
      name: 'person',
      component: person
    },{
      path: '/settings',
      name: 'settings',
      component: settings
    },{
      path: '/articlePage',
      name: 'articlePage',
      component: articlePage
    },{
      path: '/login',
      name: 'login',
      component: login
    },{
      path: '/add',
      name: 'add',
      component: add
    }
  ]
})
