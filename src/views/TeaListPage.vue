<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Teas</ion-title>
        <ion-buttons slot="end">
          <ion-button data-testid="logout-button" @click="logoutClicked">
            <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content" :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Teas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row class="ion-align-items-stretch" v-for="(row, index) in teaRows" :key="index">
          <ion-col v-for="tea of row" size="12" size-md="6" size-xl="3" :key="tea.id">
            <ion-card button @click="$router.push(`/tabs/teas/tea/${tea.id}`)">
              <ion-img :src="tea.image"></ion-img>
              <ion-card-header>
                <ion-card-title>{{ tea.name }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>{{ tea.description }}</ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/auth';
import { useTea } from '@/composables/tea';
import { Tea } from '@/models';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const { refresh, teas } = useTea();

refresh();

const teaRows = computed((): Array<Array<Tea>> => {
  const teaMatrix: Array<Array<Tea>> = [];
  let row: Array<Tea> = [];
  teas.value.forEach((t) => {
    row.push(t);
    if (row.length === 4) {
      teaMatrix.push(row);
      row = [];
    }
  });

  if (row.length) {
    teaMatrix.push(row);
  }
  return teaMatrix;
});

const { logout } = useAuth();
const router = useRouter();

const logoutClicked = async (): Promise<void> => {
  await logout();
  router.replace('/login');
};
</script>

<style scoped>
ion-card {
  height: 100%;
}

ion-col {
  margin-bottom: 1em;
}
</style>
