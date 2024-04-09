import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home/HomeView.vue'
import LoginView from '../views/Auth/LoginView.vue'
import SignupView from '../views/Auth/SignupView.vue'
import ThankYouView from '../views/Auth/ThankYouView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/thank-you',
      name: 'thankyou',
      component: ThankYouView
    },
  ]
})

export default router
