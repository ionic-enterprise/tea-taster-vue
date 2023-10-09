import { useAuth } from '@/composables/auth';
import LoginPage from '@/views/LoginPage.vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createRouter, createWebHistory, Router } from 'vue-router';

vi.mock('@/composables/auth');

describe('LoginPage.vue', () => {
  let router: Router;

  const mountView = async (): Promise<VueWrapper<any>> => {
    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes: [{ path: '/', component: LoginPage }],
    });
    router.push('/');
    await router.isReady();
    return mount(LoginPage, {
      global: {
        plugins: [router],
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAllComponents('ion-card-title') as Array<VueWrapper>;
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Login');
  });

  describe('clicking on the signin button', () => {
    let wrapper: VueWrapper<any>;
    beforeEach(async () => {
      wrapper = await mountView();
    });

    it('performs the login', async () => {
      const { login } = useAuth();
      const button = wrapper.find('[data-testid="signin-button"]');
      button.trigger('click');
      expect(login).toHaveBeenCalledTimes(1);
    });

    describe('if the login succeeds', () => {
      beforeEach(() => {
        const { login } = useAuth();
        (login as Mock).mockResolvedValue(undefined);
      });

      it('navigates to the root page', async () => {
        const button = wrapper.find('[data-testid="signin-button"]');
        router.replace = vi.fn();
        await button.trigger('click');
        await flushPromises();
        expect(router.replace).toHaveBeenCalledTimes(1);
        expect(router.replace).toHaveBeenCalledWith('/');
      });
    });

    describe('if the login fails', () => {
      beforeEach(() => {
        const { login } = useAuth();
        (login as Mock).mockRejectedValue(new Error('that login is not right'));
      });

      it('does not navigate', async () => {
        const button = wrapper.find('[data-testid="signin-button"]');
        router.replace = vi.fn();
        button.trigger('click');
        await flushPromises();
        expect(router.replace).not.toHaveBeenCalled();
      });
    });
  });
});
