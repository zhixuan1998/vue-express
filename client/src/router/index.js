import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';
import { BaseView, LoginView, SignupView, ThankYouView } from '../views/Auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { path: '/home' },
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: HomeView
                }
            ]
        },
        {
            path: '/auth',
            redirect: { path: '/login' },
            component: BaseView,
            children: [
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
                }
            ]
        }
    ]
});

export default router;
