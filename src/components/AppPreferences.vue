<template>
  <ion-header>
    <ion-toolbar>
      <ion-title> Preferences </ion-title>
      <ion-buttons slot="end">
        <ion-button :strong="true" data-testid="cancel-button" @click="cancel"> Dismiss </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header> Session Locking </ion-list-header>
      <ion-item>
        <ion-toggle
          :enableOnOffLabels="true"
          v-model="useBiometrics"
          @ionChange="useBiometricsChanged"
          :disabled="disableBiometrics"
          data-testid="bio-button"
        >
          Use Biometrics</ion-toggle
        >
      </ion-item>
      <ion-item>
        <ion-toggle
          :enableOnOffLabels="true"
          v-model="useSystemPasscode"
          @ionChange="useSystemPasscodeChanged"
          :disabled="disableSystemPasscode"
          data-testid="system-passcode-button"
        >
          Use System Passcode</ion-toggle
        >
      </ion-item>
      <ion-item>
        <ion-toggle
          :enableOnOffLabels="true"
          v-model="useCustomPasscode"
          @ionChange="useCustomPasscodeChanged"
          :disabled="disableCustomPasscode"
          data-testid="custom-passcode-button"
        >
          Use Custom Passcode
        </ion-toggle>
      </ion-item>
      <ion-list-header> Privacy </ion-list-header>
      <ion-item>
        <ion-toggle
          :enableOnOffLabels="true"
          v-model="hideInBackground"
          @ionChange="hideInBackgroundChanged"
          :disabled="disableHideInBackground"
          data-testid="hide-contents-button"
        >
          Hide contents in background
        </ion-toggle>
      </ion-item>
      <ion-list-header> Other Actions </ion-list-header>
      <ion-item button @click="logoutClicked" data-testid="logout-button">
        <ion-label> Logout </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/auth';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonTitle,
  IonToggle,
  IonToolbar,
  modalController,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { DeviceSecurityType, VaultType } from '@ionic-enterprise/identity-vault';
import { useSessionVault } from '@/composables/session-vault';

const router = useRouter();
const hideInBackground = ref(false);
const useBiometrics = ref(false);
const useSystemPasscode = ref(false);
const useCustomPasscode = ref(false);
const disableBiometrics = ref(false);
const disableCustomPasscode = ref(false);
const disableHideInBackground = ref(false);
const disableSystemPasscode = ref(false);

const cancel = async () => {
  await modalController.dismiss();
};

const hideInBackgroundChanged = async () => {
  const { hideContentsInBackground } = useSessionVault();
  await hideContentsInBackground(hideInBackground.value);
};

const useBiometricsChanged = async () => {
  if (useBiometrics.value) {
    useCustomPasscode.value = false;
  }
  await setVaultLockMode();
};

const useCustomPasscodeChanged = async () => {
  if (useCustomPasscode.value) {
    useBiometrics.value = false;
    useSystemPasscode.value = false;
  }
  await setVaultLockMode();
};

const useSystemPasscodeChanged = async () => {
  if (useSystemPasscode.value) {
    useCustomPasscode.value = false;
  }
  await setVaultLockMode();
};

const setVaultLockMode = (): Promise<void> => {
  const { setUnlockMode } = useSessionVault();
  if (useCustomPasscode.value) {
    return setUnlockMode('CustomPasscode');
  }
  if (useBiometrics.value && useSystemPasscode.value) {
    return setUnlockMode('BiometricsWithPasscode');
  }
  if (useBiometrics.value) {
    return setUnlockMode('Biometrics');
  }
  if (useSystemPasscode.value) {
    return setUnlockMode('SystemPasscode');
  }
  return setUnlockMode('SecureStorage');
};

const logoutClicked = async () => {
  const { logout } = useAuth();
  await logout();
  router.replace('/login');
  modalController.dismiss();
};

const initialize = async () => {
  const {
    canHideContentsInBackground,
    canUseBiometrics,
    canUseCustomPasscode,
    canUseSystemPasscode,
    getUnlockMode,
    isHidingContentsInBackground,
  } = useSessionVault();

  disableHideInBackground.value = !canHideContentsInBackground();
  disableBiometrics.value = !(await canUseBiometrics());
  disableCustomPasscode.value = !canUseCustomPasscode();
  disableSystemPasscode.value = !(await canUseSystemPasscode());

  hideInBackground.value = await isHidingContentsInBackground();

  const unlockMode = await getUnlockMode();

  useBiometrics.value = unlockMode === 'Biometrics' || unlockMode === 'BiometricsWithPasscode';
  useSystemPasscode.value = unlockMode === 'SystemPasscode' || unlockMode === 'BiometricsWithPasscode';
  useCustomPasscode.value = unlockMode === 'CustomPasscode';
};

initialize();
</script>

<style scoped></style>
