import { UnlockMode, useSessionVault } from '@/composables/session-vault';
import { useVaultFactory } from '@/composables/vault-factory';
import router from '@/router';
import { Preferences } from '@capacitor/preferences';
import { AuthResult } from '@ionic-enterprise/auth';
import { BiometricPermissionState, Device, DeviceSecurityType, VaultType } from '@ionic-enterprise/identity-vault';
import { isPlatform } from '@ionic/vue';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@capacitor/preferences');
vi.mock('@/composables/vault-factory');
vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
  },
}));
vi.mock('@ionic/vue', async () => {
  const actual = (await vi.importActual('@ionic/vue')) as any;
  return {
    ...actual,
    isPlatform: vi.fn().mockReturnValue(false),
  };
});

describe('useSessionVault', () => {
  let mockVault: any;
  const testSession = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: 'test-id-token',
  };

  beforeEach(() => {
    const { createVault } = useVaultFactory();
    mockVault = createVault({
      key: 'io.ionic.teatastervue',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 5000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    });
    vi.clearAllMocks();
  });

  it('starts with an undefined session', async () => {
    const { getSession } = useSessionVault();
    expect(await getSession()).toBeUndefined();
  });

  describe('canUseBiometrics', () => {
    describe('on the web', () => {
      beforeEach(() => {
        (isPlatform as Mock).mockReturnValue(false);
      });

      it('resolves false if biometrics is not set up', async () => {
        Device.isBiometricsEnabled = vi.fn().mockResolvedValue(false);
        const { canUseBiometrics } = useSessionVault();
        expect(await canUseBiometrics()).toBe(false);
      });

      it('resolves false if biometrics is set up', async () => {
        Device.isBiometricsEnabled = vi.fn().mockResolvedValue(true);
        const { canUseBiometrics } = useSessionVault();
        expect(await canUseBiometrics()).toBe(false);
      });
    });

    describe('on mobile', () => {
      beforeEach(() => {
        (isPlatform as Mock).mockReturnValue(true);
      });

      it('resolves false if biometrics is not set up', async () => {
        Device.isBiometricsEnabled = vi.fn().mockResolvedValue(false);
        const { canUseBiometrics } = useSessionVault();
        expect(await canUseBiometrics()).toBe(false);
      });

      it('resolves true if biometrics is set up', async () => {
        Device.isBiometricsEnabled = vi.fn().mockResolvedValue(true);
        const { canUseBiometrics } = useSessionVault();
        expect(await canUseBiometrics()).toBe(true);
      });
    });
  });

  describe('canUseSystemPasscode', () => {
    describe('on the web', () => {
      beforeEach(() => {
        (isPlatform as Mock).mockReturnValue(false);
      });

      it('resolves false if the system passcode is not set', async () => {
        Device.isSystemPasscodeSet = vi.fn().mockResolvedValue(false);
        const { canUseSystemPasscode } = useSessionVault();
        expect(await canUseSystemPasscode()).toBe(false);
      });

      it('resolves false if the system passcode is set', async () => {
        Device.isSystemPasscodeSet = vi.fn().mockResolvedValue(true);
        const { canUseSystemPasscode } = useSessionVault();
        expect(await canUseSystemPasscode()).toBe(false);
      });
    });

    describe('on mobile', () => {
      beforeEach(() => {
        (isPlatform as Mock).mockReturnValue(true);
      });

      it('resolves false if the system passcode is not set', async () => {
        Device.isSystemPasscodeSet = vi.fn().mockResolvedValue(false);
        const { canUseSystemPasscode } = useSessionVault();
        expect(await canUseSystemPasscode()).toBe(false);
      });

      it('resolves false if the system passcode is set', async () => {
        Device.isSystemPasscodeSet = vi.fn().mockResolvedValue(true);
        const { canUseSystemPasscode } = useSessionVault();
        expect(await canUseSystemPasscode()).toBe(true);
      });
    });
  });

  describe('canUseCustomPasscode', () => {
    it('returns false if on the web ', () => {
      const { canUseCustomPasscode } = useSessionVault();
      (isPlatform as Mock).mockReturnValue(false);
      expect(canUseCustomPasscode()).toBe(false);
    });

    it('returns true if on hybrid', () => {
      const { canUseCustomPasscode } = useSessionVault();
      (isPlatform as Mock).mockReturnValue(true);
      expect(canUseCustomPasscode()).toBe(true);
    });
  });

  describe('canHideContentsInBackground', () => {
    it('returns false if on the web ', () => {
      const { canHideContentsInBackground } = useSessionVault();
      (isPlatform as Mock).mockReturnValue(false);
      expect(canHideContentsInBackground()).toBe(false);
    });

    it('returns true if on hybrid', () => {
      const { canHideContentsInBackground } = useSessionVault();
      (isPlatform as Mock).mockReturnValue(true);
      expect(canHideContentsInBackground()).toBe(true);
    });
  });

  describe('hideContentsInBackground', () => {
    it.each([[true], [false]])('calls the device API', async (value: boolean) => {
      Device.setHideScreenOnBackground = vi.fn();
      const { hideContentsInBackground } = useSessionVault();
      await hideContentsInBackground(value);
      expect(Device.setHideScreenOnBackground).toHaveBeenCalledTimes(1);
      expect(Device.setHideScreenOnBackground).toHaveBeenCalledWith(value, true);
    });

    it.each([[true], [false]])('saves the value to preferences', async (value: boolean) => {
      const { hideContentsInBackground } = useSessionVault();
      await hideContentsInBackground(value);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({ key: 'hide-in-background', value: value.toString() });
    });
  });

  describe('isHidingContentsInBackground', () => {
    it.each([
      [true, 'true'],
      [false, 'false'],
      [false, null],
    ])('resolves %s for a preference of %s', async (result: boolean, value: string | null) => {
      (Preferences.get as Mock).mockResolvedValue({ value });
      const { isHidingContentsInBackground } = useSessionVault();
      expect(await isHidingContentsInBackground()).toBe(result);
    });
  });

  describe('setSession', () => {
    it('sets the session', async () => {
      const { getSession, setSession } = useSessionVault();
      await setSession(testSession as AuthResult);
      expect(await getSession()).toEqual(testSession);
    });

    it('stores the session in the vault', async () => {
      const { setSession } = useSessionVault();
      await setSession(testSession as AuthResult);
      expect(mockVault.setValue).toHaveBeenCalledTimes(1);
      expect(mockVault.setValue).toHaveBeenCalledWith('session', testSession);
    });
  });

  describe('clearSession', () => {
    beforeEach(async () => {
      const { setSession } = useSessionVault();
      await setSession(testSession as AuthResult);
    });

    it('clears the session', async () => {
      const { getSession, clearSession } = useSessionVault();
      await clearSession();
      expect(await getSession()).toBeUndefined();
    });

    it('clears the vault', async () => {
      const { clearSession } = useSessionVault();
      await clearSession();
      expect(mockVault.clear).toHaveBeenCalledTimes(1);
    });

    it('resets the unlock mode', async () => {
      const { clearSession } = useSessionVault();
      const expectedConfig = {
        ...mockVault.config,
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
      };
      await clearSession();
      expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
      expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
    });
  });

  describe('getSession', () => {
    beforeEach(async () => {
      const { clearSession } = useSessionVault();
      await clearSession();
    });

    it('gets the session from the vault', async () => {
      const { getSession } = useSessionVault();
      (mockVault.getValue as Mock).mockResolvedValue(testSession);
      expect(await getSession()).toEqual(testSession);
      expect(mockVault.getValue).toHaveBeenCalledTimes(1);
      expect(mockVault.getValue).toHaveBeenCalledWith('session');
    });

    it('caches the retrieved session', async () => {
      const { getSession } = useSessionVault();
      (mockVault.getValue as Mock).mockResolvedValue(testSession);
      await getSession();
      await getSession();
      expect(mockVault.getValue).toHaveBeenCalledTimes(1);
    });

    it('caches the session set via setSession', async () => {
      const { getSession, setSession } = useSessionVault();
      await setSession(testSession as AuthResult);
      expect(await getSession()).toEqual(testSession);
      expect(mockVault.getValue).not.toHaveBeenCalled();
    });
  });

  describe('getUnlockMode', () => {
    it('resolves the saved preference', async () => {
      (Preferences.get as Mock).mockResolvedValue({ value: 'BiometricsWithPasscode' });
      const { getUnlockMode } = useSessionVault();
      expect(await getUnlockMode()).toBe('BiometricsWithPasscode');
    });

    it('resolves to SecureStorage by default', async () => {
      (Preferences.get as Mock).mockResolvedValue({ value: null });
      const { getUnlockMode } = useSessionVault();
      expect(await getUnlockMode()).toBe('SecureStorage');
    });
  });

  describe('setUnlockMode', () => {
    describe.each([['Biometrics' as UnlockMode], ['BiometricsWithPasscode' as UnlockMode]])(
      'Biometrics security',
      (unlockMode: UnlockMode) => {
        beforeEach(() => {
          Device.showBiometricPrompt = vi.fn();
        });

        it('shows a bio prompt if provisioning the permission is required', async () => {
          Device.isBiometricsAllowed = vi.fn().mockResolvedValue(BiometricPermissionState.Prompt);
          const { setUnlockMode } = useSessionVault();
          await setUnlockMode(unlockMode);
          expect(Device.showBiometricPrompt).toHaveBeenCalledTimes(1);
          expect(Device.showBiometricPrompt).toHaveBeenCalledWith({
            iosBiometricsLocalizedReason: 'Please authenticate to continue',
          });
        });

        it('does not show a bio prompt if the permission has already been granted', async () => {
          Device.isBiometricsAllowed = vi.fn().mockResolvedValue(BiometricPermissionState.Granted);
          const { setUnlockMode } = useSessionVault();
          await setUnlockMode(unlockMode);
          expect(Device.showBiometricPrompt).not.toHaveBeenCalled();
        });

        it('does not show a bio prompt if the permission has already been denied', async () => {
          Device.isBiometricsAllowed = vi.fn().mockResolvedValue(BiometricPermissionState.Denied);
          const { setUnlockMode } = useSessionVault();
          await setUnlockMode(unlockMode);
          expect(Device.showBiometricPrompt).not.toHaveBeenCalled();
        });
      }
    );

    it.each([
      ['Biometrics' as UnlockMode, VaultType.DeviceSecurity, DeviceSecurityType.Biometrics],
      ['BiometricsWithPasscode' as UnlockMode, VaultType.DeviceSecurity, DeviceSecurityType.Both],
      ['SystemPasscode' as UnlockMode, VaultType.DeviceSecurity, DeviceSecurityType.SystemPasscode],
      ['CustomPasscode' as UnlockMode, VaultType.CustomPasscode, DeviceSecurityType.None],
      ['SecureStorage' as UnlockMode, VaultType.SecureStorage, DeviceSecurityType.None],
    ])(
      'Sets the unlock mode for %s',
      async (unlockMode: UnlockMode, type: VaultType, deviceSecurityType: DeviceSecurityType) => {
        const expectedConfig = {
          ...mockVault.config,
          type,
          deviceSecurityType,
        };
        const { setUnlockMode } = useSessionVault();
        await setUnlockMode(unlockMode);
        expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
        expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
        expect(Preferences.set).toHaveBeenCalledTimes(1);
        expect(Preferences.set).toHaveBeenCalledWith({ key: 'LastUnlockMode', value: unlockMode });
      }
    );
  });

  describe('canUnlock', () => {
    it.each([
      [false, 'SecureStorage' as UnlockMode, false, true],
      [false, 'SecureStorage' as UnlockMode, true, true],
      [false, 'SecureStorage' as UnlockMode, false, false],
      [true, 'Biometrics' as UnlockMode, false, true],
      [false, 'Biometrics' as UnlockMode, true, true],
      [false, 'Biometrics' as UnlockMode, false, false],
      [true, 'BiometricsWithPasscode' as UnlockMode, false, true],
      [false, 'BiometricsWithPasscode' as UnlockMode, true, true],
      [false, 'BiometricsWithPasscode' as UnlockMode, false, false],
      [true, 'SystemPasscode' as UnlockMode, false, true],
      [false, 'SystemPasscode' as UnlockMode, true, true],
      [false, 'SystemPasscode' as UnlockMode, false, false],
      [true, 'CustomPasscode' as UnlockMode, false, true],
      [false, 'CustomPasscode' as UnlockMode, true, true],
      [false, 'CustomPasscode' as UnlockMode, false, false],
    ])(
      'is %s for %s, empty: %s, locked: %s',
      async (expected: boolean, mode: UnlockMode, empty: boolean, locked: boolean) => {
        (mockVault.isEmpty as Mock).mockResolvedValue(empty);
        (mockVault.isLocked as Mock).mockResolvedValue(locked);
        (Preferences.get as Mock).mockResolvedValue({ value: mode });
        const { canUnlock } = useSessionVault();
        expect(await canUnlock()).toBe(expected);
      }
    );
  });

  describe('on lock', () => {
    beforeEach(async () => {
      const { setSession } = useSessionVault();
      await setSession(testSession as AuthResult);
      (mockVault.getValue as Mock).mockResolvedValue(undefined);
    });

    it('clears the session cache', async () => {
      const { getSession } = useSessionVault();
      mockVault.lock();
      await getSession();
      expect(mockVault.getValue).toHaveBeenCalledTimes(1);
    });

    it('goes to the unlock page', () => {
      mockVault.lock();
      expect(router.replace).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith('/unlock');
    });
  });
});
