import { useAuth } from '@/composables/auth';
import TeaListPage from '@/views/TeaListPage.vue';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Router, createRouter, createWebHistory } from 'vue-router';

vi.mock('@/composables/auth');

describe('tea list page', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: TeaListPage }],
    });
    router.push('/');
    await router.isReady();
    return mount(TeaListPage, {
      global: {
        plugins: [router],
      },
    });
  };

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAll('ion-title');
    expect(titles).toHaveLength(2);
    expect(titles[0].text()).toBe('Teas');
    expect(titles[1].text()).toBe('Teas');
  });

  describe('with seven teas', () => {
    it('displays two rows', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      expect(rows).toHaveLength(2);
    });

    it('displays four columns in the first row', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[0].findAll('ion-col');
      expect(cols).toHaveLength(4);
    });

    it('displays three columns in the second row', async () => {
      const wrapper = await mountView();
      const rows = wrapper.findAll('ion-grid ion-row');
      const cols = rows[1].findAll('ion-col');
      expect(cols).toHaveLength(3);
    });

    it('displays the name in the title', async () => {
      const wrapper = await mountView();
      const teas = (wrapper.getCurrentComponent() as any).setupState.teaData;
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-header ion-card-title');
        expect(title.text()).toBe(teas[idx].name);
      });
    });

    it('displays the description in the content', async () => {
      const wrapper = await mountView();
      const teas = (wrapper.getCurrentComponent() as any).setupState.teaData;
      const cols = wrapper.findAll('ion-col');
      cols.forEach((c, idx) => {
        const title = c.find('ion-card ion-card-content');
        expect(title.text()).toBe(teas[idx].description);
      });
    });
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
