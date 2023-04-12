<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { SplashScreen } from '@capacitor/splash-screen';
import { useSessionVault } from '@/composables/session-vault';

const initialize = async () => {
  const { hideContentsInBackground, isHidingContentsInBackground } = useSessionVault();
  await SplashScreen.hide();
  const hide = await isHidingContentsInBackground();
  hideContentsInBackground(hide);
};

initialize();
</script>
