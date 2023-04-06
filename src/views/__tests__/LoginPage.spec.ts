import LoginPage from '@/views/LoginPage.vue';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import waitForExpect from 'wait-for-expect';

describe('LoginPage.vue', () => {
  it('displays the title', () => {
    const wrapper = mount(LoginPage);
    const titles = wrapper.findAllComponents('ion-title') as Array<VueWrapper>;
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe('Login');
  });

  describe('email input', () => {
    it('starts untouched', () => {
      const wrapper = mount(LoginPage);
      const email = wrapper.findComponent('[data-testid="email-input"]');
      expect(email.classes()).not.toContain('ion-touched');
    });

    it('obtains ion-touched on blur', async () => {
      const wrapper = mount(LoginPage);
      const email = wrapper.findComponent('[data-testid="email-input"]');
      (email as VueWrapper<any>).vm.$emit('ionBlur', { target: email.element });
      expect(email.classes()).toContain('ion-touched');
    });

    it('is marked invalid or valid based on format', async () => {
      const wrapper = mount(LoginPage);
      const email = wrapper.findComponent('[data-testid="email-input"]');
      await email.setValue('test');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-valid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-invalid'));
      await email.setValue('test@testy.com');
      await waitForExpect(() => expect(email.classes()).not.toContain('ion-invalid'));
      await waitForExpect(() => expect(email.classes()).toContain('ion-valid'));
    });

    it('is marked valid or invalid based on being required', async () => {
      const wrapper = mount(LoginPage);
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
    it('starts untouched', () => {
      const wrapper = mount(LoginPage);
      const password = wrapper.findComponent('[data-testid="password-input"]');
      expect(password.classes()).not.toContain('ion-touched');
    });

    it('obtains ion-touched on blur', async () => {
      const wrapper = mount(LoginPage);
      const password = wrapper.findComponent('[data-testid="password-input"]');
      (password as VueWrapper<any>).vm.$emit('ionBlur', { target: password.element });
      expect(password.classes()).toContain('ion-touched');
    });

    it('is marked valid or invalid based on being required', async () => {
      const wrapper = mount(LoginPage);
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
      const wrapper = mount(LoginPage);
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
  });
});
