import { vi } from 'vitest';

const remove = vi.fn().mockResolvedValue({ data: null });
const post = vi.fn().mockResolvedValue({ data: null });
const get = vi.fn().mockResolvedValue({ data: null });

export const useBackendAPI = () => ({
  client: {
    delete: remove,
    post,
    get,
  },
});
