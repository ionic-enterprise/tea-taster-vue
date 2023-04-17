<template>
  <ion-page>
    <ion-content class="main-content">
      <ion-card>
        <ion-card-header>
          <ion-card-title> Login </ion-card-title>
          <ion-card-subtitle>Welcome to Tea Taster</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div class="auth-button-area">
            <ion-button expand="block" color="aws" @click="signinClicked()" data-testid="signin-button">
              <ion-icon slot="end" :icon="logoAmazon"></ion-icon>
              Sign In with AWS
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-content>
    <ion-toast
      :isOpen="loginFailed"
      message="Login failed!"
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
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonToast,
} from '@ionic/vue';
import { ref } from 'vue';
import { logoAmazon } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/auth';

const { login } = useAuth();
const router = useRouter();
const loginFailed = ref(false);

const signinClicked = async () => {
  try {
    await login();
    router.replace('/');
  } catch (e) {
    loginFailed.value = true;
  }
};
</script>

<style scoped>
.auth-button-area {
  margin-top: 1em;
  font-size: large;
}

@media (min-width: 0px) {
  ion-card {
    margin-top: 45%;
    margin-left: 5%;
    margin-right: 5%;
  }
}

@media (min-width: 576px) {
  ion-card {
    margin-top: 35%;
    margin-left: 10%;
    margin-right: 10%;
  }
}

@media (min-width: 768px) {
  ion-card {
    margin-top: 30%;
    margin-left: 20%;
    margin-right: 20%;
  }
}

@media (min-width: 992px) {
  ion-card {
    margin-top: 30%;
    margin-left: 25%;
    margin-right: 25%;
  }
}

@media (min-width: 1200px) {
  ion-card {
    margin-top: 20%;
    margin-left: 30%;
    margin-right: 30%;
  }
}
</style>
