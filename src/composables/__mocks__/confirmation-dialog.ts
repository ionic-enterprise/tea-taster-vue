import { vi } from 'vitest';

const confirm = vi.fn().mockResolvedValue(false);

export const useConfirmationDialog = () => ({ confirm });
