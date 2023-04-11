import { vi } from 'vitest';
import { ref } from 'vue';
import { TastingNote } from '@/models';

const notes = ref<Array<TastingNote>>([]);
const find = vi.fn().mockResolvedValue(undefined);
const merge = vi.fn().mockResolvedValue(undefined);
const refresh = vi.fn().mockResolvedValue(undefined);
const remove = vi.fn().mockResolvedValue(undefined);

export const useTastingNotes = () => ({
  notes,
  find,
  merge,
  refresh,
  remove,
});
