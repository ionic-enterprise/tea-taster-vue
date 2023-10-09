import AboutPage from '@/views/AboutPage.vue';
import { IonTitle } from '@ionic/vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Router } from 'vue-router';

// Required by AppPreferences
vi.mock('@/composables/vault-factory');
vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
  },
}));

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
});
