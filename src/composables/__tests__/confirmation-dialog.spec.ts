import { alertController } from '@ionic/vue';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useConfirmationDialog } from '../confirmation-dialog';

vi.mock('@ionic/vue', async () => {
  const actual = vi.importActual('@ionic/vue');
  return {
    ...actual,
    alertController: { create: vi.fn() },
  };
});

describe('confirmation dialog', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('confirm', () => {
    let dialog: any;
    beforeEach(() => {
      dialog = {
        present: vi.fn(),
        onDidDismiss: vi.fn().mockResolvedValue({ role: 'cancel' }),
      };
      (alertController.create as Mock).mockResolvedValue(dialog);
    });

    it('creates an alert', async () => {
      const { confirm } = useConfirmationDialog();
      await confirm('Delete tag', 'Are you sure you want to remove this tag?');
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Delete tag',
        message: 'Are you sure you want to remove this tag?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            role: 'confirm',
          },
        ],
      });
    });

    it('presents the dialog', async () => {
      const { confirm } = useConfirmationDialog();
      await confirm('Delete tag', 'Are you sure you want to remove this tag?');
      expect(dialog.present).toHaveBeenCalledTimes(1);
    });

    it('resolves false on no', async () => {
      const { confirm } = useConfirmationDialog();
      expect(await confirm('Delete tag', 'Are you sure you want to remove this tag?')).toBe(false);
    });

    it('resolves true on yes', async () => {
      const { confirm } = useConfirmationDialog();
      (dialog.onDidDismiss as Mock).mockResolvedValue({ role: 'confirm' });
      expect(await confirm('Delete tag', 'Are you sure you want to remove this tag?')).toBe(true);
    });
  });
});
