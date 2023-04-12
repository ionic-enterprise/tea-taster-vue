import { vi } from 'vitest';

let onLockCallback: (() => Promise<void>) | undefined;

const canHideContentsInBackground = vi.fn().mockResolvedValue(false);
const canUnlock = vi.fn().mockResolvedValue(false);
const canUseBiometrics = vi.fn().mockResolvedValue(false);
const canUseCustomPasscode = vi.fn().mockResolvedValue(false);
const canUseSystemPasscode = vi.fn().mockResolvedValue(false);
const clearSession = vi.fn().mockResolvedValue(undefined);
const setSession = vi.fn().mockResolvedValue(undefined);
const getSession = vi.fn().mockResolvedValue(undefined);
const getUnlockMode = vi.fn().mockResolvedValue('SecureStorage');
const hideContentsInBackground = vi.fn().mockResolvedValue(undefined);
const isHidingContentsInBackground = vi.fn().mockResolvedValue(undefined);
const setUnlockMode = vi.fn().mockResolvedValue(undefined);
const onLock = vi.fn().mockImplementation((cb: () => Promise<void>) => (onLockCallback = cb));
const lock = vi.fn().mockImplementation(() => {
  if (onLockCallback) {
    onLockCallback();
  }
});

export const useSessionVault = () => ({
  canHideContentsInBackground,
  canUnlock,
  canUseBiometrics,
  canUseCustomPasscode,
  canUseSystemPasscode,
  clearSession,
  setSession,
  getSession,
  getUnlockMode,
  hideContentsInBackground,
  isHidingContentsInBackground,
  setUnlockMode,
  onLock,
  lock,
});
