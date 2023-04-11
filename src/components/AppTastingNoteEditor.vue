<template>
  <ion-header>
    <ion-toolbar>
      <ion-title class="ion-text-center">{{ title }}</ion-title>
      <ion-buttons slot="start">
        <ion-button data-testid="cancel-button" @click="cancel"> Cancel </ion-button>
      </ion-buttons>
      <ion-buttons slot="end">
        <ion-button :strong="true" :disabled="formIsInvalid" data-testid="submit-button" @click="submit">{{
          buttonText
        }}</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
      <ion-item>
        <ion-input name="brand" v-model="brand" label="Brand" label-placement="floating" data-testid="brand-input">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          name="name"
          v-model="name"
          label="Name"
          label-placement="floating"
          data-testid="name-input"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-select name="teaCategoryId" v-model.number="teaCategoryId" label="Type" data-testid="tea-type-select">
          <ion-select-option v-for="t of teas" :value="t.id" :key="t.id">{{ t.name }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item>
        <ion-label>Rating</ion-label>
        <app-rating name="rating" v-model.number="rating" data-testid="rating-input"></app-rating>
      </ion-item>

      <ion-item>
        <ion-textarea
          name="notes"
          v-model="notes"
          :rows="4"
          label="Notes"
          label-placement="floating"
          data-testid="notes-textbox"
        ></ion-textarea>
      </ion-item>
    </ion-list>

    <div class="ion-padding" data-testid="message-area">
      <div v-for="(error, idx) of errors" :key="idx">
        <ion-text color="danger">
          {{ error }}
        </ion-text>
      </div>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { computed } from 'vue';
import { useForm, useField } from 'vee-validate';
import { number as yupNumber, object as yupObject, string as yupString } from 'yup';
import { useTea } from '@/composables/tea';
import AppRating from './AppRating.vue';
import { useTastingNotes } from '@/composables/tasting-notes';
import { TastingNote } from '@/models';

const { refresh, teas } = useTea();

const props = defineProps({
  noteId: Number,
});

const validationSchema = yupObject({
  brand: yupString().required().label('Brand'),
  name: yupString().required().label('Name'),
  teaCategoryId: yupNumber().required().label('Type of Tea'),
  rating: yupNumber().required().label('Rating'),
  notes: yupString().required().label('Notes'),
});
const { errors, meta } = useForm({ validationSchema });

const { value: brand } = useField<string>('brand');
const { value: name } = useField<string>('name');
const { value: teaCategoryId } = useField<number>('teaCategoryId');
const { value: rating } = useField<number>('rating');
const { value: notes } = useField<string>('notes');

const formIsInvalid = computed(() => !meta.value.valid);
const buttonText = computed(() => (props.noteId ? 'Update' : 'Add'));
const title = computed(() => `${props.noteId ? 'Update' : 'Add'} Note`);

const initialize = async () => {
  if (props.noteId) {
    const { find } = useTastingNotes();
    const note = await find(props.noteId);
    if (note) {
      brand.value = note.brand;
      name.value = note.name;
      notes.value = note.notes;
      teaCategoryId.value = note.teaCategoryId;
      rating.value = note.rating;
    }
  }

  if (teas.value.length === 0) {
    refresh();
  }
};

const cancel = async () => {
  await modalController.dismiss();
};

const submit = async () => {
  let note: TastingNote = {
    brand: brand.value,
    name: name.value,
    teaCategoryId: teaCategoryId.value,
    rating: rating.value,
    notes: notes.value,
  };
  if (props.noteId) {
    note = { id: props.noteId, ...note };
  }
  const { merge } = useTastingNotes();
  await merge(note);
  await modalController.dismiss();
};

initialize();
</script>

<style scoped></style>
