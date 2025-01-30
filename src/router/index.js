import { createRouter, createWebHistory } from 'vue-router';

const AuthBaseView = () => import('@/views/Auth/BaseView.vue');
const LoginView = () => import('@/views/Auth/LoginView.vue');
const SignupView = () => import('@/views/Auth/SignupView.vue');
const ThankYouView = () => import('@/views/Auth/ThankYouView.vue');

const HomeView = () => import('@/views/Home/HomeView.vue');

const BrandView = () => import('@/views/Product/BrandView.vue');
const CategoryView = () => import('@/views/Product/CategoryView.vue');

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: { path: '/home' },
            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: HomeView
                }
            ]
        },
        {
            path: '/auth',
            redirect: { path: '/login' },
            component: AuthBaseView,
            children: [
                {
                    path: '/login',
                    name: 'Login',
                    component: LoginView
                },
                {
                    path: '/signup',
                    name: 'Signup',
                    component: SignupView
                },
                {
                    path: '/thank-you',
                    name: 'ThankYou',
                    component: ThankYouView
                }
            ]
        },
        {
            path: '/brands/:brandId',
            name: 'ProductBrand',
            component: BrandView
        },
        {
            path: '/categories/:categoryId',
            name: 'ProductCategory',
            component: CategoryView
        }
    ]
});

export default router;
