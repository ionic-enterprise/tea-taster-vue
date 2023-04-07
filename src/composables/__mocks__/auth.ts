import { vi } from 'vitest';

const login = vi.fn().mockResolvedValue(false);
const logout = vi.fn().mockResolvedValue(undefined);

export const useAuth = () => ({
  login,
  logout,
});
