import { Session } from '@/models';
import { Preferences } from '@capacitor/preferences';

const key = 'session';
let session: Session | null = null;

const clearSession = async (): Promise<void> => {
  session = null;
  Preferences.remove({ key });
};

const getSession = async (): Promise<Session | null> => {
  if (!session) {
    const { value } = await Preferences.get({ key });
    if (value) {
      session = JSON.parse(value);
    }
  }
  return session;
};

const setSession = async (s: Session): Promise<void> => {
  session = s;
  const value = JSON.stringify(s);
  await Preferences.set({ key, value });
};

export const useSession = () => {
  return {
    clearSession,
    getSession,
    setSession,
  };
};
