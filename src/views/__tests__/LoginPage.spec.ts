import { useAuth } from '@/composables/auth';
import LoginPage from '@/views/LoginPage.vue';
import { IonCardTitle } from '@ionic/vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it, Mock, vi } from 'vitest';
import { Router, createRouter, createWebHistory } from 'vue-router';
import waitForExpect from 'wait-for-expect';

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

  it('displays the title', async () => {
    const wrapper = await mountView();
    const titles = wrapper.findAllComponents(IonCardTitle) as Array<VueWrapper>;
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Login');
  });

  describe('email input', () => {
    it('starts untouched', async () => {
      const wrapper = await mountView();
      const email = wrapper.findComponent('[data-testid="email-input"]');
      expect(email.classes()).not.toContain('ion-touched');
    });

    it('obtains ion-touched on blur', async () => {
      const wrapper = await mountView();
      const email = wrapper.findComponent('[data-testid="email-input"]');
      (email as VueWrapper<any>).vm.$emit('ionBlur', { target: email.element });
      expect(email.classes()).toContain('ion-touched');
    });

    it('is marked invalid or valid based on format', async () => {
      const wrapper = await mountView();
      const email = wrapper.findComponent('[data-testid="email-input"]');
      await email.setValue('test');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-valid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-invalid'));
      await email.setValue('test@testy.com');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-invalid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-valid'));
    });

    it('is marked valid or invalid based on being required', async () => {
      const wrapper = await mountView();
      const email = wrapper.findComponent('[data-testid="email-input"]');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-invalid'));
      await email.setValue('test@testy.com');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-invalid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-valid'));
      await email.setValue('');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-valid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-invalid'));
    });
  });

  describe('password input', () => {
    it('starts untouched', async () => {
      const wrapper = await mountView();
      const password = wrapper.findComponent('[data-testid="password-input"]');
      expect(password.classes()).not.toContain('ion-touched');
    });

    it('obtains ion-touched on blur', async () => {
      const wrapper = await mountView();
      const password = wrapper.findComponent('[data-testid="password-input"]');
      (password as VueWrapper<any>).vm.$emit('ionBlur', { target: password.element });
      expect(password.classes()).toContain('ion-touched');
    });

    it('is marked valid or invalid based on being required', async () => {
      const wrapper = await mountView();
      const password = wrapper.findComponent('[data-testid="password-input"]');
      await waitForExpect(() => expect(password.classes()).not.toContain('ion-invalid'));
      await password.setValue('test@testy.com');
      await waitForExpect(() => expect(password.classes()).not.toContain('ion-invalid'));
      await waitForExpect(() => expect(password.classes()).toContain('ion-valid'));
      await password.setValue('');
      await waitForExpect(() => expect(password.classes()).not.toContain('ion-valid'));
      await waitForExpect(() => expect(password.classes()).toContain('ion-invalid'));
    });
  });

  describe('sign in button', () => {
    it('has a disabled signin button until valid data is entered', async () => {
      const wrapper = await mountView();
      const button = wrapper.find('[data-testid="signin-button"]');
      const email = wrapper.findComponent('[data-testid="email-input"]');
      const password = wrapper.findComponent('[data-testid="password-input"]');

      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await email.setValue('foobar');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await password.setValue('mypassword');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(true));

      await email.setValue('foobar@baz.com');
      await flushPromises();
      await waitForExpect(() => expect((button.element as HTMLIonButtonElement).disabled).toBe(false));
    });

    describe('clicking', () => {
      let wrapper: VueWrapper<any>;
      beforeEach(async () => {
        wrapper = await mountView();
        const email = wrapper.findComponent('[data-testid="email-input"]');
        const password = wrapper.findComponent('[data-testid="password-input"]');
        await email.setValue('test@test.com');
        await password.setValue('test');
      });

      it('performs the login', async () => {
        const { login } = useAuth();
        const button = wrapper.find('[data-testid="signin-button"]');
        button.trigger('click');
        expect(login).toHaveBeenCalledTimes(1);
        expect(login).toHaveBeenCalledWith('test@test.com', 'test');
      });

      describe('if the login succeeds', () => {
        beforeEach(() => {
          const { login } = useAuth();
          (login as Mock).mockResolvedValue(true);
        });

        it('navigates to the root page', async () => {
          const button = wrapper.find('[data-testid="signin-button"]');
          router.replace = vi.fn();
          button.trigger('click');
          await flushPromises();
          expect(router.replace).toHaveBeenCalledTimes(1);
          expect(router.replace).toHaveBeenCalledWith('/');
        });
      });

      describe('if the login fails', () => {
        beforeEach(() => {
          const { login } = useAuth();
          (login as Mock).mockResolvedValue(false);
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
});
