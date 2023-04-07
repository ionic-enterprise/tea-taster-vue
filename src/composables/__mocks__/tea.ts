import { Tea } from '@/models';
import { vi } from 'vitest';
import { ref } from 'vue';

const refresh = vi.fn().mockResolvedValue(undefined);
const teas = ref<Array<Tea>>([]);

export const useTea = () => ({
  refresh,
  teas,
});
