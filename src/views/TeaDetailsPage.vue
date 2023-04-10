<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tea Details</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/teas" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="tea">
        <div class="ion-justify-content-center" style="display: flex">
          <ion-img :src="tea.image"></ion-img>
        </div>
        <h1 data-testid="name">{{ tea.name }}</h1>
        <p data-testid="description">{{ tea.description }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonImg, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Tea } from '@/models';
import { useTea } from '@/composables/tea';

const { params } = useRoute();
const id = parseInt(params.id as string, 10);
const tea = ref<Tea | undefined>();

const { find } = useTea();
find(id).then((t) => (tea.value = t));
</script>

<style scoped>
ion-img {
  max-width: 75%;
  max-height: 512px;
}
</style>
