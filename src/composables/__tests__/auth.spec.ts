import { useAuth } from '@/composables/auth';
import { useBackendAPI } from '@/composables/backend-api';
import { useSession } from '@/composables/session';
import { User } from '@/models';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

vi.mock('@/composables/backend-api');
vi.mock('@/composables/session');

describe('useAuth', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    const { login } = useAuth();
    const { client } = useBackendAPI();
    beforeEach(() => {
      (client.post as Mock).mockResolvedValue({
        data: { success: false },
      });
    });

    it('posts to the login endpoint', async () => {
      await login('test@test.com', 'testpassword');
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/login', {
        username: 'test@test.com',
        password: 'testpassword',
      });
    });

    describe('when the login fails', () => {
      it('resolves false', async () => {
        expect(await login('test@test.com', 'password')).toEqual(false);
      });
    });

    describe('when the login succeeds', () => {
      let user: User;
      beforeEach(() => {
        user = {
          id: 314159,
          firstName: 'Testy',
          lastName: 'McTest',
          email: 'test@test.com',
        };
        (client.post as Mock).mockResolvedValue({
          data: {
            success: true,
            user,
            token: '123456789',
          },
        });
      });

      it('resolves true', async () => {
        expect(await login('test@test.com', 'password')).toEqual(true);
      });

      it('sets the session', async () => {
        await login('test@test.com', 'password');
        expect(useSession().setSession).toHaveBeenCalledTimes(1);
        expect(useSession().setSession).toHaveBeenCalledWith({
          user,
          token: '123456789',
        });
      });
    });
  });

  describe('logout', () => {
    const { logout } = useAuth();
    const { client } = useBackendAPI();

    it('posts to the logout endpoint', async () => {
      await logout();
      expect(client.post).toHaveBeenCalledTimes(1);
      expect(client.post).toHaveBeenCalledWith('/logout', {});
    });

    it('clears the session', async () => {
      await logout();
      expect(useSession().clearSession).toHaveBeenCalledTimes(1);
    });
  });
});
