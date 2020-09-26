import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/dashboard'
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
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('../views/Dashboard/DashboardHome.vue') },
      { path: 'subscriptions', component: () => import('../views/Dashboard/Subscriptions.vue') },
    ]
  },
  {
    path: '/channels',
    name: 'Channels',
    component: () => import('../views/Channel/Channels.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/channels/:id',
    name: 'View Channel',
    component: () => import('../views/Channel.vue'),
    meta: { requiresAuth: false },
    children: [
        { path: '', component: () => import('../views/Channel/ChannelEdit.vue') },
        { path: 'task/new', component: () => import('../views/Channel/TaskEdit.vue'), meta: { requiresAuth: true } },
        { path: 'task/:taskKey', component: () => import('../views/Channel/ViewTask.vue') },
        { path: 'task/:taskKey/edit', component: () => import('../views/Channel/TaskEdit.vue'), meta: { requiresAuth: true } },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
