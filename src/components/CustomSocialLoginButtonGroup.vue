<template>
  <div class="flex" :class="[isMobile ? 'flex-column' : 'flex-row']">
    <custom-button @click="socialLogin(PROVIDER_TYPE.GOOGLE)">
      <font-awesome-icon :icon="faGoogle" />
    </custom-button>

    <custom-button @click="socialLogin(PROVIDER_TYPE.FACEBOOK)" disabled>
      <font-awesome-icon :icon="faFacebook" />
    </custom-button>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

import { useUserStore } from '../stores';
import { useMediaQuery, useFirebaseAuth } from '../composables';

const PROVIDER_TYPE = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
};

const $modal = inject('modal');

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const [isMobile] = useMediaQuery([{ maxWidth: '450px' }]);
const providerGroup = useFirebaseAuth(Object.values(PROVIDER_TYPE));

async function socialLogin(providerType) {
  const result = await providerGroup[providerType]?.signIn();
  const accessToken = result?.accessToken;

  const success = accessToken
    ? await userStore.socialLogin({
        provider: providerType,
        accessToken
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
