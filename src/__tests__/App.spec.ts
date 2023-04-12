import { flushPromises, shallowMount } from '@vue/test-utils';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App.vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { useSessionVault } from '@/composables/session-vault';

vi.mock('@capacitor/splash-screen');
vi.mock('@/composables/session-vault');

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

  it.each([[true], [false]])('sets the background hiding', async (value: boolean) => {
    const { hideContentsInBackground, isHidingContentsInBackground } = useSessionVault();
    (isHidingContentsInBackground as Mock).mockResolvedValue(value);
    shallowMount(App);
    await flushPromises();
    expect(hideContentsInBackground).toHaveBeenCalledOnce();
    expect(hideContentsInBackground).toHaveBeenCalledWith(value);
  });
});
