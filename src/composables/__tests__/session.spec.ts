import { useSession } from '@/composables/session';
import { Session } from '@/models';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@capacitor/preferences');

describe('useSession', () => {
  const testSession: Session = {
    user: {
      id: 314159,
      firstName: 'Testy',
      lastName: 'McTest',
      email: 'test@test.com',
    },
    token: '123456789',
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (Preferences.get as Mock).mockResolvedValue({ value: null });
  });

  it('starts with a null session', async () => {
    const { getSession } = useSession();
    expect(await getSession()).toBeNull();
  });

  describe('setSession', () => {
    it('sets the session', async () => {
      const { getSession, setSession } = useSession();
      await setSession(testSession);
      expect(await getSession()).toEqual(testSession);
    });

    it('stores the session', async () => {
      const { setSession } = useSession();
      await setSession(testSession);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'session',
        value: JSON.stringify(testSession),
      });
    });
  });

  describe('getSession', () => {
    beforeEach(async () => {
      const { clearSession } = useSession();
      await clearSession();
    });

    it('gets the session from preferences', async () => {
      const { getSession } = useSession();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(testSession),
      });
      expect(await getSession()).toEqual(testSession);
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({ key: 'session' });
    });

    it('caches the retrieved session', async () => {
      const { getSession } = useSession();
      (Preferences.get as Mock).mockResolvedValue({
        value: JSON.stringify(testSession),
      });
      await getSession();
      await getSession();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
    });

    it('caches the session set via setSession', async () => {
      const { getSession, setSession } = useSession();
      await setSession(testSession);
      expect(await getSession()).toEqual(testSession);
      expect(Preferences.get).not.toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    beforeEach(async () => {
      const { setSession } = useSession();
      await setSession(testSession);
    });

    it('clears the session', async () => {
      const { getSession, clearSession } = useSession();
      await clearSession();
      expect(await getSession()).toBeNull();
    });

    it('removes the session fromm preferences', async () => {
      const { clearSession } = useSession();
      await clearSession();
      expect(Preferences.remove).toHaveBeenCalledTimes(1);
      expect(Preferences.remove).toHaveBeenCalledWith({ key: 'session' });
    });
  });
});
