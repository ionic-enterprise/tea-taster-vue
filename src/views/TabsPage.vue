<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="teas" href="/tabs/teas">
          <ion-label>Tea</ion-label>
          <ion-icon :icon="leaf"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="tasting-notes" href="/tabs/tasting-notes">
          <ion-label>Tasting Notes</ion-label>
          <ion-icon :icon="documentText"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="about" href="/tabs/about">
          <ion-label>About</ion-label>
          <ion-icon :icon="informationCircle"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { leaf, documentText, informationCircle } from 'ionicons/icons';
</script>

<style scoped></style>
