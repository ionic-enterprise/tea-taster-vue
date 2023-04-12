<template>
  <ion-page ref="page">
    <ion-header>
      <ion-toolbar>
        <ion-title>About Tea Taster</ion-title>
        <ion-buttons slot="end">
          <ion-button data-testid="logout-button" @click="preferencesClicked">
            <ion-icon slot="icon-only" :icon="settingsOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-text-center ion-padding main-content">
      <ion-list>
        <ion-list-header>About</ion-list-header>
        <ion-item>
          <ion-label>Name</ion-label>
          <ion-note slot="end">{{ name }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Description</ion-label>
          <ion-note slot="end">{{ description }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Version</ion-label>
          <ion-note slot="end">{{ version }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Author</ion-label>
          <ion-note slot="end">{{ author.name }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { settingsOutline } from 'ionicons/icons';
import { ref } from 'vue';
import packageInfo from '../../package.json';
import AppPreferences from '@/components/AppPreferences.vue';

const { author, description, name, version } = packageInfo;
const page = ref(null);

const preferencesClicked = async (): Promise<void> => {
  const modal = await modalController.create({ component: AppPreferences, presentingElement: (page.value as any).$el });
  await modal.present();
};
</script>

<style scoped></style>
