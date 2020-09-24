import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/channels',
    name: 'Channels',
    component: () => import('../views/Channels.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/channels/:id',
    name: 'View Channel',
    component: () => import('../views/ChannelDetail.vue'),
    meta: { requiresAuth: false },
    children: [
        { path: '', component: () => import('../views/ChannelEdit.vue') },
        { path: 'task/:taskKey', component: () => import('../views/ViewTask.vue') },
        { path: 'task/new', component: () => import('../views/TaskEdit.vue'), meta: { requiresAuth: true } },
        { path: 'task/:taskKey/edit', component: () => import('../views/TaskEdit.vue'), meta: { requiresAuth: true } },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
