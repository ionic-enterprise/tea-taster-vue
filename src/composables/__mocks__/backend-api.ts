import { vi } from 'vitest';

const post = vi.fn().mockResolvedValue({ data: null });
const get = vi.fn().mockResolvedValue({ data: null });

export const useBackendAPI = () => ({
  client: {
    post,
    get,
  },
});
