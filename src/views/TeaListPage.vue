<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Teas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Teas</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-grid>
        <ion-row class="ion-align-items-stretch" v-for="(row, index) in teaRows" :key="index">
          <ion-col v-for="tea of row" size="12" size-md="6" size-xl="3" :key="tea.id">
            <ion-card>
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
import { Tea } from '@/models';
import {
  IonCard,
  IonCol,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { computed, ref } from 'vue';

const teaData = ref<Array<Tea>>([
  {
    id: 1,
    name: 'Green',
    image: 'img/green.jpg',
    description:
      'Green teas have the oxidation process stopped very early on, leaving them with a very subtle flavor and ' +
      'complex undertones. These teas should be steeped at lower temperatures for shorter periods of time.',
  },
  {
    id: 2,
    name: 'Black',
    image: 'img/black.jpg',
    description:
      'A fully oxidized tea, black teas have a dark color and a full robust and pronounced flavor. Black teas tend ' +
      'to have a higher caffeine content than other teas.',
  },
  {
    id: 3,
    name: 'Herbal',
    image: 'img/herbal.jpg',
    description:
      'Herbal infusions are not actually "tea" but are more accurately characterized as infused beverages ' +
      'consisting of various dried herbs, spices, and fruits.',
  },
  {
    id: 4,
    name: 'Oolong',
    image: 'img/oolong.jpg',
    description:
      'Oolong teas are partially oxidized, giving them a flavor that is not as robust as black teas but also ' +
      'not as subtle as green teas. Oolong teas often have a flowery fragrance.',
  },
  {
    id: 5,
    name: 'Dark',
    image: 'img/dark.jpg',
    description:
      'From the Hunan and Sichuan provinces of China, dark teas are flavorful aged probiotic teas that steeps ' +
      'up very smooth with slightly sweet notes.',
  },
  {
    id: 6,
    name: 'Puer',
    image: 'img/puer.jpg',
    description:
      'An aged black tea from china. Puer teas have a strong rich flavor that could be described as "woody" or "peaty."',
  },
  {
    id: 7,
    name: 'White',
    image: 'img/white.jpg',
    description:
      'White tea is produced using very young shoots with no oxidation process. White tea has an extremely ' +
      'delicate flavor that is sweet and fragrant. White tea should be steeped at lower temperatures for ' +
      'short periods of time.',
  },
]);

const teaRows = computed((): Array<Array<Tea>> => {
  const teaMatrix: Array<Array<Tea>> = [];
  let row: Array<Tea> = [];
  teaData.value.forEach((t) => {
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
</script>

<style scoped>
ion-card {
  height: 100%;
}

ion-col {
  margin-bottom: 1em;
}
</style>
