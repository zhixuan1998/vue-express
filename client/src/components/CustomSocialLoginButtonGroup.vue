<template>
  <div class="flex" :class="[isMobile ? 'flex-column' : 'flex-row']">
    <custom-button @click="socialLogin('google')">
      <font-awesome-icon :icon="faGoogle" />
    </custom-button>

    <custom-button @click="socialLogin('facebook')">
      <font-awesome-icon :icon="faFacebook" />
    </custom-button>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

import { useUserStore } from '../stores';
import { useMediaQuery, useFirebaseAuth } from '../hooks';

const $modal = inject('modal');

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const [isMobile] = useMediaQuery([{ maxWidth: '450px' }]);
const providerGroup = useFirebaseAuth(['google', 'facebook']);

async function socialLogin(providerId) {
  const result = await providerGroup[providerId.toUpperCase()]?.signIn();

  const user = result?.user;

  const success = user
    ? await userStore.socialLogin({
        providerId,
        email: user.email,
        firebaseUid: user.uid,
        firstName: user.displayName,
        phoneNumber: user.phoneNumber
      })
    : false;

  success ? router.push({ path: route.query?.redirect ?? '/' }) : $modal.open();
}
</script>
<style lang="scss" scoped>
[class*='fa-'] {
  font-size: 15px;
}
</style>
