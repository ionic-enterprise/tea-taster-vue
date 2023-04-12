import { useAuth } from '@/composables/auth';
import AboutPage from '@/views/AboutPage.vue';
import { IonTitle } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { mount, VueWrapper } from '@vue/test-utils';
import { vi } from 'vitest';
import { Router } from 'vue-router';

vi.mock('@/composables/auth');

describe('TastingNotesPage.vue', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: AboutPage }],
    });
    router.push('/');
    await router.isReady();
    return mount(AboutPage, {
      global: {
        plugins: [router],
      },
    });
  };

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAllComponents(IonTitle);
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('About Tea Taster');
  });

  describe('logout button', () => {
    it('performs a logout', async () => {
      const { logout } = useAuth();
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="logout-button"]');
      router.replace = vi.fn();
      await button.trigger('click');
      expect(logout).toHaveBeenCalledTimes(1);
    });

    it('navigates to the login page', async () => {
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="logout-button"]');
      router.replace = vi.fn();
      await button.trigger('click');
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });
});
