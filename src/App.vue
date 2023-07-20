<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { useSessionVault } from '@/composables/session-vault';
import { watchEffect } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useConfirmationDialog } from '@/composables/confirmation-dialog';

const interval = 60 * 60 * 1000;
const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, interval);
  },
});

const { confirm } = useConfirmationDialog();
watchEffect(async () => {
  if (
    needRefresh.value &&
    (await confirm(
      'Update Available',
      'An update is available for this application. Would you like to refresh this application to get the update?',
    ))
  ) {
    updateServiceWorker();
  }
});

const initialize = async () => {
  const { hideContentsInBackground, isHidingContentsInBackground } = useSessionVault();
  await SplashScreen.hide();
  const hide = await isHidingContentsInBackground();
  hideContentsInBackground(hide);
};

initialize();
</script>
