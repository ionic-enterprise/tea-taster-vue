import { shallowMount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App.vue';
import { SplashScreen } from '@capacitor/splash-screen';

vi.mock('@capacitor/splash-screen');

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders', () => {
    const wrapper = shallowMount(App);
    expect(wrapper.exists()).toBe(true);
  });

  it('hides the splash screen', () => {
    shallowMount(App);
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
  });
});
