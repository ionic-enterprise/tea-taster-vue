import { vi } from 'vitest';

export const SplashScreen = {
  hide: vi.fn().mockResolvedValue(undefined),
  show: vi.fn().mockResolvedValue(undefined),
};
