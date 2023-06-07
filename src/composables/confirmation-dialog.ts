import { alertController } from '@ionic/vue';

const confirm = async (header: string, message?: string): Promise<boolean> => {
  const alert = await alertController.create({
    header,
    message,
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
  await alert.present();
  const { role } = await alert.onDidDismiss();
  return role === 'confirm';
};

export const useConfirmationDialog = () => ({ confirm });
