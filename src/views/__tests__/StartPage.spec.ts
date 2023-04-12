import { useSessionVault } from '@/composables/session-vault';
import StartPage from '@/views/StartPage.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { Mock, describe, expect, it, vi } from 'vitest';
import { Router } from 'vue-router';

vi.mock('@/composables/session-vault');
vi.mock('@/composables/vault-factory');

let router: Router;

const mountView = async (): Promise<VueWrapper<any>> => {
  router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [{ path: '/', component: StartPage }],
  });
  router.push('/');
  await router.isReady();
  router.replace = vi.fn();
  return mount(StartPage, {
    global: {
      plugins: [router],
    },
  });
};

describe('StartPage.vue', () => {
  it('routes to the teas when we cannot unlock', async () => {
    const { canUnlock } = useSessionVault();
    (canUnlock as Mock).mockResolvedValue(false);
    await mountView();
    await flushPromises();
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/tabs/teas');
  });

  it('routes to the unlock page when we can unlock', async () => {
    const { canUnlock } = useSessionVault();
    (canUnlock as Mock).mockResolvedValue(true);
    await mountView();
    await flushPromises();
    expect(router.replace).toHaveBeenCalledTimes(1);
    expect(router.replace).toHaveBeenCalledWith('/unlock');
  });
});
