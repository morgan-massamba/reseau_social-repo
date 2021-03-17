import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../views/Signup.vue'
import Post from '../views/Post.vue'
import Profile from '../views/Profile.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, 
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/post/:id',
    name: 'Post',
    component: Post, 
    props:true
  }, 
  {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile, 
    props:true
  }, 
  {
    path : '/:pathMatch(.*)*',
    redirect :'/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

//NAVIGATION GUARDS
router.beforeEach((to, from, next) => {
  if (to.name !== 'Home' && store.getters.isAuthenticated == false) next({ name: 'Home' })
  else next()
})

export default router
