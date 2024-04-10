<template>
  <div class="main-content">
    <custom-form
      class="custom-form"
      :class="{ 'small-screen-layout': changeLayout }"
      maxWidth="700px"
    >
      <div>
        <div class="thank_you-label">Thank You For Registration!</div>
        <custom-button @click="goToNextPage()">{{ buttonText }}</custom-button>
      </div>
    </custom-form>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMediaQuery } from '../../hooks';

const route = useRoute();
const router = useRouter();
const $messages = inject('messages');

const [changeLayout] = useMediaQuery([{ maxWidth: '576px' }]);
const buttonText = ref(
  route.query?.redirect ? $messages.button.continue() : $messages.button.backToHomepage()
);

function goToNextPage() {
  router.push({ path: route.query?.redirect ?? '/home' });
}
</script>

<style lang="scss" scoped>
.custom-form {
  padding: 44px 60px;

  .thank_you-label {
    text-align: center;
    font-size: 40px;
  }

  .thank_you-description {
    text-align: center;
    font-size: 16px;
  }

  .custom-button {
    max-width: 200px;
    margin: auto;
    margin-top: 30px;
  }

  &.small-screen-layout {
    padding: 0;
  }
}
</style>
