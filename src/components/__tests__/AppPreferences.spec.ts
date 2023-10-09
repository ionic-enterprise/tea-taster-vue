import AppPreferences from '@/components/AppPreferences.vue';
import { useAuth } from '@/composables/auth';
import { UnlockMode, useSessionVault } from '@/composables/session-vault';
import { modalController } from '@ionic/vue';
import { VueWrapper, flushPromises, mount } from '@vue/test-utils';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  replace: vi.fn(),
};

vi.mock('@/composables/auth');
vi.mock('@/composables/session-vault');
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as any;
  return {
    ...actual,
    modalController: {
      dismiss: vi.fn(),
    },
  };
});
vi.mock('vue-router', async () => {
  const actual = (await vi.importActual('vue-router')) as any;
  return {
    ...actual,
    useRouter: () => router,
  };
});

describe('AppPreferences.vue', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  it('renders', () => {
    const wrapper = mount(AppPreferences);
    expect(wrapper.exists()).toBe(true);
  });

  describe('biometric toggle', () => {
    it('is disabled if we cannot use biometrics', async () => {
      const { canUseBiometrics } = useSessionVault();
      (canUseBiometrics as Mock).mockResolvedValue(false);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="bio-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(true);
    });

    it('is not disabled if we can use biometrics', async () => {
      const { canUseBiometrics } = useSessionVault();
      (canUseBiometrics as Mock).mockResolvedValue(true);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="bio-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(false);
    });

    it.each([
      [true, 'BiometricsWithPasscode' as UnlockMode],
      [true, 'Biometrics' as UnlockMode],
      [false, 'SystemPasscode' as UnlockMode],
      [false, 'CustomPasscode' as UnlockMode],
      [false, 'SecureStorage' as UnlockMode],
    ])('is %s if the unlock mode is %s', async (value: boolean, unlockMode: UnlockMode) => {
      const { getUnlockMode } = useSessionVault();
      (getUnlockMode as Mock).mockResolvedValue(unlockMode);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="bio-button"]');
      expect((toggle.element as HTMLIonToggleElement).checked).toBe(value);
    });

    it('unchecks custom passcode when checked', async () => {
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const bioToggle = wrapper.findComponent('[data-testid="bio-button"]');
      const customPasscodeToggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      await customPasscodeToggle.setValue(true);
      await bioToggle.setValue(true);
      (bioToggle as VueWrapper<any>).vm.$emit('ionChange', { target: bioToggle.element });
      await flushPromises();
      expect((customPasscodeToggle.element as HTMLIonToggleElement).checked).toBe(false);
    });

    it.each([
      [true, false, 'Biometrics'],
      [true, true, 'BiometricsWithPasscode'],
      [false, true, 'SystemPasscode'],
      [false, false, 'SecureStorage'],
    ])('sets the unlock mode correctly', async (bio: boolean, sys: boolean, mode: string) => {
      const { setUnlockMode } = useSessionVault();
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const bioToggle = wrapper.findComponent('[data-testid="bio-button"]');
      const systemPasscodeToggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      await systemPasscodeToggle.setValue(sys);
      await bioToggle.setValue(bio);
      (bioToggle as VueWrapper<any>).vm.$emit('ionChange', { target: bioToggle.element });
      await flushPromises();
      expect(setUnlockMode).toHaveBeenCalledTimes(1);
      expect(setUnlockMode).toHaveBeenCalledWith(mode);
    });
  });

  describe('system passcode toggle', () => {
    it('is disabled if we cannot use the system passcode', async () => {
      const { canUseSystemPasscode } = useSessionVault();
      (canUseSystemPasscode as Mock).mockResolvedValue(false);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(true);
    });

    it('is not disabled if we can use the system passcode', async () => {
      const { canUseSystemPasscode } = useSessionVault();
      (canUseSystemPasscode as Mock).mockResolvedValue(true);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(false);
    });

    it.each([
      [true, 'BiometricsWithPasscode' as UnlockMode],
      [false, 'Biometrics' as UnlockMode],
      [true, 'SystemPasscode' as UnlockMode],
      [false, 'CustomPasscode' as UnlockMode],
      [false, 'SecureStorage' as UnlockMode],
    ])('is %s if the unlock mode is %s', async (value: boolean, unlockMode: UnlockMode) => {
      const { getUnlockMode } = useSessionVault();
      (getUnlockMode as Mock).mockResolvedValue(unlockMode);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).checked).toBe(value);
    });

    it('unchecks custom passcode when checked', async () => {
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const systemPasscodeToggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      const customPasscodeToggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      await customPasscodeToggle.setValue(true);
      await systemPasscodeToggle.setValue(true);
      (systemPasscodeToggle as VueWrapper<any>).vm.$emit('ionChange', { target: systemPasscodeToggle.element });
      await flushPromises();
      expect((customPasscodeToggle.element as HTMLIonToggleElement).checked).toBe(false);
    });

    it.each([
      [true, false, 'Biometrics'],
      [true, true, 'BiometricsWithPasscode'],
      [false, true, 'SystemPasscode'],
      [false, false, 'SecureStorage'],
    ])('sets the unlock mode correctly', async (bio: boolean, sys: boolean, mode: string) => {
      const { setUnlockMode } = useSessionVault();
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const bioToggle = wrapper.findComponent('[data-testid="bio-button"]');
      const systemPasscodeToggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      await systemPasscodeToggle.setValue(sys);
      await bioToggle.setValue(bio);
      (systemPasscodeToggle as VueWrapper<any>).vm.$emit('ionChange', { target: systemPasscodeToggle.element });
      await flushPromises();
      expect(setUnlockMode).toHaveBeenCalledTimes(1);
      expect(setUnlockMode).toHaveBeenCalledWith(mode);
    });
  });

  describe('custom passcode toggle', () => {
    it('is disabled if we cannot use the custom passcode', async () => {
      const { canUseCustomPasscode } = useSessionVault();
      (canUseCustomPasscode as Mock).mockReturnValue(false);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(true);
    });

    it('is not disabled if we can use the custom passcode', async () => {
      const { canUseCustomPasscode } = useSessionVault();
      (canUseCustomPasscode as Mock).mockReturnValue(true);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(false);
    });

    it.each([
      [false, 'BiometricsWithPasscode' as UnlockMode],
      [false, 'Biometrics' as UnlockMode],
      [false, 'SystemPasscode' as UnlockMode],
      [true, 'CustomPasscode' as UnlockMode],
      [false, 'SecureStorage' as UnlockMode],
    ])('is %s if the unlock mode is %s', async (value: boolean, unlockMode: UnlockMode) => {
      const { getUnlockMode } = useSessionVault();
      (getUnlockMode as Mock).mockResolvedValue(unlockMode);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      expect((toggle.element as HTMLIonToggleElement).checked).toBe(value);
    });

    it('unchecks bio and system passcode when checked', async () => {
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const bioToggle = wrapper.findComponent('[data-testid="bio-button"]');
      const systemPasscodeToggle = wrapper.findComponent('[data-testid="system-passcode-button"]');
      const customPasscodeToggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      await bioToggle.setValue(true);
      await systemPasscodeToggle.setValue(true);
      await customPasscodeToggle.setValue(true);
      (customPasscodeToggle as VueWrapper<any>).vm.$emit('ionChange', { target: customPasscodeToggle.element });
      await flushPromises();
      expect((bioToggle.element as HTMLIonToggleElement).checked).toBe(false);
      expect((systemPasscodeToggle.element as HTMLIonToggleElement).checked).toBe(false);
    });

    it('sets the vault type to use custom passcode when set', async () => {
      const { setUnlockMode } = useSessionVault();
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const customPasscodeToggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      await customPasscodeToggle.setValue(true);
      (customPasscodeToggle as VueWrapper<any>).vm.$emit('ionChange', { target: customPasscodeToggle.element });
      expect(setUnlockMode).toHaveBeenCalledTimes(1);
      expect(setUnlockMode).toHaveBeenCalledWith('CustomPasscode');
    });

    it('sets the vault type to use secure storage when unset', async () => {
      const { setUnlockMode } = useSessionVault();
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const customPasscodeToggle = wrapper.findComponent('[data-testid="custom-passcode-button"]');
      await customPasscodeToggle.setValue(false);
      (customPasscodeToggle as VueWrapper<any>).vm.$emit('ionChange', { target: customPasscodeToggle.element });
      expect(setUnlockMode).toHaveBeenCalledTimes(1);
      expect(setUnlockMode).toHaveBeenCalledWith('SecureStorage');
    });
  });

  describe('hide in background button', () => {
    it('is disabled if we cannot use the custom passcode', async () => {
      const { canHideContentsInBackground } = useSessionVault();
      (canHideContentsInBackground as Mock).mockReturnValue(false);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="hide-contents-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(true);
    });

    it('is not disabled if we can use the custom passcode', async () => {
      const { canHideContentsInBackground } = useSessionVault();
      (canHideContentsInBackground as Mock).mockReturnValue(true);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="hide-contents-button"]');
      expect((toggle.element as HTMLIonToggleElement).disabled).toBe(false);
    });

    it.each([[true], [false]])('is %s on initialization', async (value: boolean) => {
      const { isHidingContentsInBackground } = useSessionVault();
      (isHidingContentsInBackground as Mock).mockResolvedValue(value);
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="hide-contents-button"]');
      expect((toggle.element as HTMLIonToggleElement).checked).toBe(value);
    });

    it.each([[true], [false]])('sets the hide to %s', async (value: boolean) => {
      const { hideContentsInBackground } = useSessionVault();
      const wrapper = mount(AppPreferences);
      await flushPromises();
      const toggle = wrapper.findComponent('[data-testid="hide-contents-button"]');
      await toggle.setValue(value);
      (toggle as VueWrapper<any>).vm.$emit('ionChange', { target: toggle.element });
      expect(hideContentsInBackground).toHaveBeenCalledTimes(1);
      expect(hideContentsInBackground).toHaveBeenCalledWith(value);
    });
  });

  describe('logout button', () => {
    it('performs a logout', async () => {
      const wrapper = mount(AppPreferences);
      const { logout } = useAuth();
      const button = wrapper.find('[data-testid="logout-button"]');
      await button.trigger('click');
      expect(logout).toHaveBeenCalledTimes(1);
    });

    it('navigates to the login page', async () => {
      const wrapper = mount(AppPreferences);
      const button = wrapper.find('[data-testid="logout-button"]');
      await button.trigger('click');
      await flushPromises();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith('/login');
    });

    it('closes the modal', async () => {
      const wrapper = mount(AppPreferences);
      const button = wrapper.find('[data-testid="logout-button"]');
      await button.trigger('click');
      await flushPromises();
      expect(modalController.dismiss).toHaveBeenCalledTimes(1);
    });
  });
});
