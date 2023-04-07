import { useSession } from '@/composables/session';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/teas',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/teas',
    name: 'Tea List',
    component: () => import('@/views/TeaListPage.vue'),
    meta: { requiresAuth: true },
  },
];

const { getSession } = useSession();

const checkAuthStatus = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const session = await getSession();
  if (!session && to.matched.some((r) => r.meta.requiresAuth)) {
    return next('/login');
  }
  next();
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuthStatus);

export default router;
