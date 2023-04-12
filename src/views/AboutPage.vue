<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>About Tea Taster</ion-title>
        <ion-buttons slot="end">
          <ion-button data-testid="logout-button" @click="logoutClicked">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
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
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import packageInfo from '../../package.json';
import { useAuth } from '@/composables/auth';
import { useRouter } from 'vue-router';

const { author, description, name, version } = packageInfo;

const { logout } = useAuth();
const router = useRouter();

const logoutClicked = async (): Promise<void> => {
  await logout();
  router.replace('/login');
};
</script>

<style scoped></style>
