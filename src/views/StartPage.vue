<template>
  <ion-page>
    <ion-content class="main-content"> </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { useSessionVault } from '@/composables/session-vault';
const { canUnlock } = useSessionVault();
const router = useRouter();
// This strategy takes you to the login page if there is a session to be unlocked.
// From there, the user can choose to unlock or sign in again.
canUnlock().then((x: boolean) => {
  if (x) {
    router.replace('/unlock');
  } else {
    router.replace('/tabs/teas');
  }
});
// If you comment out the above strategy and go with this one, when there is a locked session,
// the user will be prompted to unlock the vault automatically by the auth-guard when it tries
// to get the session.
// router.replace('/tabs/teas');
</script>
