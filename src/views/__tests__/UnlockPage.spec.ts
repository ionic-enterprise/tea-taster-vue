import { useAuth } from '@/composables/auth';
import { useSessionVault } from '@/composables/session-vault';
import UnlockPage from '@/views/UnlockPage.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { VueWrapper, flushPromises, mount } from '@vue/test-utils';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Router } from 'vue-router';

vi.mock('@/composables/auth');
vi.mock('@/composables/session-vault');

let router: Router;
const mountView = async (): Promise<VueWrapper<any>> => {
  router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [{ path: '/', component: UnlockPage }],
  });
  router.push('/');
  await router.isReady();
  router.replace = vi.fn().mockResolvedValue(undefined);
  return mount(UnlockPage, {
    global: {
      plugins: [router],
    },
  });
};

describe('UnlockPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays an unlock prompt', async () => {
    const wrapper = await mountView();
    const prompt = wrapper.find('[data-testid="unlock-button"]');
    expect(prompt.text()).toBe('Unlock');
  });

  it('displays a redo login prompt', async () => {
    const wrapper = await mountView();
    const prompt = wrapper.find('[data-testid="redo-button"]');
    expect(prompt.text()).toBe('Redo Sign In');
  });

  describe('the unlock button', () => {
    it('tries to get the session', async () => {
      const { getSession } = useSessionVault();
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="unlock-button"]');
      await button.trigger('click');
      expect(getSession).toHaveBeenCalledTimes(1);
    });

    it('navigates to the root', async () => {
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="unlock-button"]');
      await button.trigger('click');
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith('/');
    });

    describe('when the user cancels', () => {
      it('does not navigate', async () => {
        const { getSession } = useSessionVault();
        (getSession as Mock).mockRejectedValue(new Error('whatever, dude'));
        const wrapper = await mountView();
        const button = wrapper.find('[data-testid="unlock-button"]');
        await button.trigger('click');
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });

  describe('the redo button', () => {
    it('clears the vault', async () => {
      const { clearSession } = useSessionVault();
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="redo-button"]');
      await button.trigger('click');
      await flushPromises();
      expect(clearSession).toHaveBeenCalledTimes(1);
    });

    it('logs the user out', async () => {
      const { logout } = useAuth();
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="redo-button"]');
      await button.trigger('click');
      await flushPromises();
      expect(logout).toHaveBeenCalledTimes(1);
    });

    it('navigates to the login page', async () => {
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="redo-button"]');
      await button.trigger('click');
      await flushPromises();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith('/login');
    });
  });
});
