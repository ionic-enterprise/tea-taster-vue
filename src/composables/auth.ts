import { useBackendAPI } from './backend-api';
import { useSession } from './session';

const { client } = useBackendAPI();
const { clearSession, setSession } = useSession();

const login = async (email: string, password: string): Promise<boolean> => {
  const response = await client.post('/login', { username: email, password });
  if (response.data.success) {
    setSession({
      user: response.data.user,
      token: response.data.token,
    });
    return true;
  }
  return false;
};

const logout = async (): Promise<void> => {
  await client.post('/logout', {});
  await clearSession();
};

export const useAuth = () => {
  return {
    login,
    logout,
  };
};
