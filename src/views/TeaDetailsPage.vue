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
        <app-rating data-testid="rating" v-model="rating" @click="ratingClicked"></app-rating>
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
import AppRating from '@/components/AppRating.vue';

const { params } = useRoute();
const id = parseInt(params.id as string, 10);
const tea = ref<Tea | undefined>();
const rating = ref<number>(3);

const { find, rate } = useTea();
find(id).then((t) => {
  tea.value = t;
  rating.value = t?.rating || 0;
});

const ratingClicked = async () => {
  if (tea.value) {
    rate(tea.value.id, rating.value);
  }
};
</script>

<style scoped>
ion-img {
  max-width: 75%;
  max-height: 512px;
}
</style>
