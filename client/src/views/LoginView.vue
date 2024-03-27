<template>
  <custom-header>
    <template #right-content> Log In </template>
  </custom-header>
  <div class="main-content" :class="{ mobile: isMobile }">
    <custom-form title="Log In" description="Please enter your credentials" :maxWidth="maxWidth">
      <template #body-section>
        <div class="credential-section">
          <custom-form-control
            v-model="username"
            label="Phone number / Username / Email"
            verticalLayout
          >
            <template #error-messages>
              <!-- <p class="error-message-item">{{ $messages.required() }}</p> -->
            </template>
          </custom-form-control>

          <custom-form-control v-model="password" label="Password" type="password" verticalLayout>
            <template #error-messages>
              <!-- <p class="error-message-item">{{ $messages.required() }}</p>
              <p class="error-message-item">{{ $messages.required() }}</p>
              <p class="error-message-item">{{ $messages.required() }}</p>
              <p class="error-message-item">{{ $messages.required() }}</p> -->
            </template>
          </custom-form-control>

          <custom-button text="LOG IN" />
        </div>
        <custom-separator />
        <div></div>
      </template>
    </custom-form>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { useMediaQuery } from '../hooks';

const route = useRoute();
const router = useRouter();

const maxWidth = '400px';
const isMobile = useMediaQuery({ maxWidth });

const username = ref('');
const password = ref('');
</script>

<style lang="scss">
.main-content {
  display: flex;
  height: 600px;
  background-color: rgba(228, 206, 255, 0.3);

  & > * {
    margin: auto;
  }

  .credential-section {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }
}

.main-content.mobile {
  height: auto;

  & > * {
    margin-top: 0;
  }
}
</style>