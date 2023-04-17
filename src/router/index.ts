import { useSessionVault } from '@/composables/session-vault';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { NavigationGuardNext, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import StartPage from '@/views/StartPage.vue';
import { useAuth } from '@/composables/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Startup',
    component: StartPage,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/unlock',
    name: 'Unlock',
    component: () => import('@/views/UnlockPage.vue'),
  },
  {
    path: '/auth-action-complete',
    name: 'Auth Action Complete',
    component: () => import('@/views/AuthActionCompletePage.vue'),
  },
  {
    path: '/tabs/',
    component: () => import('@/views/TabsPage.vue'),
    children: [
      {
        path: '',
        redirect: '/tabs/teas',
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/AboutPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tasting-notes',
        name: 'Tasting Notes',
        component: () => import('@/views/TastingNotesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'teas',
        name: 'Tea List',
        component: () => import('@/views/TeaListPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'teas/tea/:id',
        name: 'Tea Details',
        component: () => import('@/views/TeaDetailsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];

const checkAuthStatus = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (to.matched.some((r) => r.meta.requiresAuth)) {
    const { isAuthenticated } = useAuth();
    if (!(await isAuthenticated())) {
      return next('/login');
    }
  }
  next();
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(checkAuthStatus);

export default router;
