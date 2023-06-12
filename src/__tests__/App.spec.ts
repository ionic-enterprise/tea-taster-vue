import App from '@/App.vue';
import { useConfirmationDialog } from '@/composables/confirmation-dialog';
import { useSessionVault } from '@/composables/session-vault';
import { SplashScreen } from '@capacitor/splash-screen';
import { flushPromises, shallowMount } from '@vue/test-utils';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

vi.mock('@capacitor/splash-screen');
vi.mock('@/composables/confirmation-dialog');
vi.mock('@/composables/session-vault');
vi.mock('virtual:pwa-register/vue');

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRegisterSW as Mock).mockReturnValue({
      needRefresh: ref(false),
      updateServiceWorker: vi.fn(),
    });
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

  it('registers the service worker', () => {
    shallowMount(App);
    expect(useRegisterSW).toHaveBeenCalledTimes(1);
  });

  it('asks to update the service worker as needed', async () => {
    const { needRefresh } = useRegisterSW();
    const { confirm } = useConfirmationDialog();
    shallowMount(App);
    expect(confirm).not.toHaveBeenCalled();
    needRefresh.value = true;
    await flushPromises();
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('updates the app on confirm', async () => {
    const { needRefresh, updateServiceWorker } = useRegisterSW();
    const { confirm } = useConfirmationDialog();
    (confirm as Mock).mockResolvedValue(true);
    shallowMount(App);
    expect(updateServiceWorker).not.toHaveBeenCalled();
    needRefresh.value = true;
    await flushPromises();
    expect(updateServiceWorker).toHaveBeenCalledTimes(1);
  });

  it('does not update the app if the user does not confirm', async () => {
    const { needRefresh, updateServiceWorker } = useRegisterSW();
    const { confirm } = useConfirmationDialog();
    (confirm as Mock).mockResolvedValue(false);
    shallowMount(App);
    expect(updateServiceWorker).not.toHaveBeenCalled();
    needRefresh.value = true;
    await flushPromises();
    expect(updateServiceWorker).not.toHaveBeenCalled();
  });
});
