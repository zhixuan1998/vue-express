import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home/HomeView.vue';
import { AuthBaseView, LoginView, SignupView, ThankYouView } from '../views/Auth';
import { ProductBaseView, BrandView, CategoryView } from '../views/Product';

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
            path: '/products',
            name: 'Product',
            component: ProductBaseView,
            children: [
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
        }
    ]
});

export default router;
