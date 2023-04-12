import { Session } from '@/models';
import { useVaultFactory } from '@/composables/vault-factory';
import { BiometricPermissionState, Device, DeviceSecurityType, VaultType } from '@ionic-enterprise/identity-vault';
import router from '@/router';
import { isPlatform, modalController } from '@ionic/vue';
import AppPinDialog from '@/components/AppPinDialog.vue';
import { Preferences } from '@capacitor/preferences';

export type UnlockMode =
  | 'Biometrics'
  | 'BiometricsWithPasscode'
  | 'SystemPasscode'
  | 'CustomPasscode'
  | 'SecureStorage';

const sessionKey = 'session';
const hideInBackgroundKey = 'hide-in-background';
const modeKey = 'LastUnlockMode';
let session: Session | null | undefined;

const { createVault } = useVaultFactory();
const vault = createVault({
  key: 'io.ionic.teatastervue',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  lockAfterBackgrounded: 5000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 2,
  unlockVaultOnLoad: false,
});

vault.onLock(() => {
  session = undefined;
  router.replace('/unlock');
});

vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) => {
  const dlg = await modalController.create({
    backdropDismiss: false,
    component: AppPinDialog,
    componentProps: {
      setPasscodeMode: isPasscodeSetRequest,
    },
  });
  dlg.present();
  const { data } = await dlg.onDidDismiss();
  vault.setCustomPasscode(data || '');
});

const canUnlock = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: modeKey });
  return (value || 'SecureStorage') !== 'SecureStorage' && !(await vault.isEmpty()) && (await vault.isLocked());
};

const canHideContentsInBackground = (): boolean => isPlatform('hybrid');
const canUseBiometrics = async (): Promise<boolean> => isPlatform('hybrid') && (await Device.isBiometricsEnabled());
const canUseCustomPasscode = (): boolean => isPlatform('hybrid');
const canUseSystemPasscode = async (): Promise<boolean> => isPlatform('hybrid') && (await Device.isSystemPasscodeSet());

const getSession = async (): Promise<Session | null | undefined> => {
  if (!session) {
    session = await vault.getValue(sessionKey);
  }
  return session;
};

const hideContentsInBackground = async (value: boolean): Promise<void> => {
  await Device.setHideScreenOnBackground(value, true);
  return Preferences.set({ key: hideInBackgroundKey, value: JSON.stringify(value) });
};

const isHidingContentsInBackground = async (): Promise<boolean> => {
  const { value } = await Preferences.get({ key: hideInBackgroundKey });
  return JSON.parse(value || 'false');
};

const setSession = async (s: Session): Promise<void> => {
  session = s;
  return vault.setValue(sessionKey, s);
};

const provision = async (): Promise<void> => {
  if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
    } catch (error) {
      null;
    }
  }
};

const getUnlockMode = async (): Promise<UnlockMode> => {
  const { value } = await Preferences.get({ key: modeKey });
  return (value as UnlockMode | null) || 'SecureStorage';
};

const setUnlockMode = async (unlockMode: UnlockMode): Promise<void> => {
  let type: VaultType;
  let deviceSecurityType: DeviceSecurityType;

  switch (unlockMode) {
    case 'Biometrics':
      await provision();
      type = VaultType.DeviceSecurity;
      deviceSecurityType = DeviceSecurityType.Biometrics;
      break;

    case 'BiometricsWithPasscode':
      await provision();
      type = VaultType.DeviceSecurity;
      deviceSecurityType = DeviceSecurityType.Both;
      break;

    case 'SystemPasscode':
      type = VaultType.DeviceSecurity;
      deviceSecurityType = DeviceSecurityType.SystemPasscode;
      break;

    case 'CustomPasscode':
      type = VaultType.CustomPasscode;
      deviceSecurityType = DeviceSecurityType.None;
      break;

    case 'SecureStorage':
      type = VaultType.SecureStorage;
      deviceSecurityType = DeviceSecurityType.None;
      break;

    default:
      type = VaultType.SecureStorage;
      deviceSecurityType = DeviceSecurityType.None;
  }

  await vault.updateConfig({
    ...vault.config,
    type,
    deviceSecurityType,
  });
  await Preferences.set({ key: modeKey, value: unlockMode });
};

const clearSession = async (): Promise<void> => {
  session = undefined;
  await vault.clear();
  await setUnlockMode('SecureStorage');
};

export const useSessionVault = () => {
  return {
    canUnlock,
    canHideContentsInBackground,
    canUseBiometrics,
    canUseCustomPasscode,
    canUseSystemPasscode,
    clearSession,
    getSession,
    getUnlockMode,
    hideContentsInBackground,
    isHidingContentsInBackground,
    setSession,
    setUnlockMode,
  };
};
