<template>
  <ion-page>
    <ion-content class="ion-padding main-content">
      <ion-card>
        <ion-card-header>
          <ion-card-title> Login </ion-card-title>
          <ion-card-subtitle>Welcome to Tea Taster</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-input
            ref="emailInput"
            type="email"
            name="email"
            label="Email"
            label-placement="floating"
            v-model="email"
            :error-text="errors.email || 'valid'"
            @ionBlur="markTouched"
            data-testid="email-input"
          ></ion-input>

          <ion-input
            ref="passwordInput"
            type="password"
            name="password"
            label="Password"
            label-placement="floating"
            v-model="password"
            :error-text="errors.password || 'valid'"
            @ionBlur="markTouched"
            data-testid="password-input"
          ></ion-input>

          <ion-button expand="full" :disabled="formIsInvalid" @click="signinClicked" data-testid="signin-button">
            Sign In
            <ion-icon slot="end" :icon="logInOutline"></ion-icon>
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
    <ion-toast
      :isOpen="loginFailed"
      message="Invalid Email or Password!"
      color="danger"
      :duration="3000"
      position="middle"
      @didDismiss="loginFailed = false"
    ></ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonToast,
} from '@ionic/vue';
import { logInOutline } from 'ionicons/icons';
import { useForm, useField } from 'vee-validate';
import { object as yupObject, string as yupString } from 'yup';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/auth';

const emailInput = ref(null);
const passwordInput = ref(null);
const loginFailed = ref(false);

const validationSchema = yupObject({
  email: yupString().email().required().label('Email Address'),
  password: yupString().required().label('Password'),
});
const { errors, meta } = useForm({ validationSchema });

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const formIsInvalid = computed(() => !meta.value.valid);

watch(errors, (newValue: { email?: string; password?: string }) => {
  if (newValue.email) {
    setInvalid((emailInput.value as any)?.$el);
  } else {
    setValid((emailInput.value as any)?.$el);
  }

  if (newValue.password) {
    setInvalid((passwordInput.value as any)?.$el);
  } else {
    setValid((passwordInput.value as any)?.$el);
  }
});

const setInvalid = (el?: Element) => {
  el?.classList.remove('ion-valid');
  el?.classList.add('ion-invalid');
};

const setValid = (el?: Element) => {
  el?.classList.remove('ion-invalid');
  el?.classList.add('ion-valid');
};

const markTouched = (evt: Event) => {
  (evt.target as Element).classList.add('ion-touched');
};

const { login } = useAuth();
const router = useRouter();

const signinClicked = async () => {
  if (await login(email.value, password.value)) {
    router.replace('/');
  } else {
    loginFailed.value = true;
  }
};
</script>

<style scoped>
@media (min-width: 0px) {
  ion-card {
    margin-top: 25%;
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (min-width: 576px) {
  ion-card {
    margin-top: 20%;
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (min-width: 768px) {
  ion-card {
    margin-top: 10%;
    margin-left: 20%;
    margin-right: 20%;
  }
}

@media (min-width: 992px) {
  ion-card {
    margin-top: 10%;
    margin-left: 25%;
    margin-right: 25%;
  }
}

@media (min-width: 1200px) {
  ion-card {
    margin-top: 10%;
    margin-left: 30%;
    margin-right: 30%;
  }
}
</style>
