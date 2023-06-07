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

const interval = 6 * 1000;

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, interval);
  },
});

watchEffect(() => {
  if (needRefresh.value) {
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
