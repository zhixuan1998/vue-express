<template>
  <custom-header>
    <template #right-content> Log In </template>
  </custom-header>
  <div class="main-content" :class="{ mobile: isMobile }">
    <custom-form title="Log In" description="Please enter your credentials" :maxWidth="maxWidth">
      <template #body-section>
        <div class="credential-section">
          <custom-form-control
            v-model="credentials.email"
            label="Email"
            verticalLayout
          >
            <template v-if="$v.email.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.email.required.$invalid"
                :message="$messages.validations.required()"
              />
              <custom-error-message
                v-if="$v.email.format.$invalid"
                :message="$messages.validations.invalidFormat('email')"
              />
            </template>
          </custom-form-control>

          <custom-form-control
            v-model="credentials.password"
            label="Password"
            type="password"
            :maxLength="20"
            verticalLayout
          >
            <template v-if="$v.password.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.password.required.$invalid"
                :message="$messages.validations.required()"
              />
              <custom-error-message
                v-if="$v.password.format.$invalid"
                :message="$messages.validations.passwordFormat()"
              />
            </template>
          </custom-form-control>

          <custom-button text="LOG IN" @click="login" />
        </div>
        <custom-separator text="OR" />
        <div></div>
      </template>
    </custom-form>
  </div>
</template>

<script setup>
import { reactive, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRoute, useRouter } from 'vue-router';
import { required } from '@vuelidate/validators';

import { useMediaQuery } from '../../hooks';
import { useUserStore } from '../../Store'

const { userRepository: $userRepository } = inject('repositories');
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const maxWidth = '400px';
const isMobile = useMediaQuery({ maxWidth });
const credentials = reactive({
  email: '',
  password: ''
});

const $v = useVuelidate(
  {
    email: {
      required,
      format: (value) => value.test(/^/)
    },
    password: {
      required,
      format: (value) =>
        value.test(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/)
    }
  },
  credentials
);

const login = async () => {
  $v.value.$touch();
  // const result = await $userRepository.login({
  //   username: credentials.username,
  //   password: credentials.password
  // });
  // router.push({ name: 'home' });
};
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
