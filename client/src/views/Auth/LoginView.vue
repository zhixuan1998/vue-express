<template>
  <div class="main-content" :class="{ mobile: isMobile }">
    <custom-form
      :header="{ title: 'Log In', description: 'Please enter your credentials' }"
      :maxWidth="maxWidth"
    >
      <div class="credential-section">
        <custom-form-control
          v-model:input="credentials.email"
          :label="$messages.label.email()"
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
          v-model:input="credentials.password"
          :label="$messages.label.password()"
          actualType="password"
          :maxLength="20"
          verticalLayout
        >
          <template v-if="$v.password.$dirty" #error-messages>
            <custom-error-message
              v-if="$v.password.required.$invalid"
              :message="$messages.validations.required()"
            />
          </template>
        </custom-form-control>

        <custom-button style="margin-top: 15px" @click="login">{{
          $messages.button.login()
        }}</custom-button>
        <p class="forgot-password">{{ $messages.label.forgotPassword() }}</p>
      </div>
      <custom-separator text="OR" />
      <div></div>
    </custom-form>
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRoute, useRouter } from 'vue-router';
import { required, email } from '@vuelidate/validators';

import { useMediaQuery } from '../../hooks';
import { useUserStore } from '../../stores';

const $messages = inject('messages');
const $modal = inject('modal');

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const maxWidth = '450px';
const [isMobile] = useMediaQuery([{ maxWidth }]);

const credentials = reactive({
  email: '',
  password: ''
});

const resetForm = () => {
  credentials.email = '';
  credentials.password = '';

  $v.value.$reset();
};

const login = async () => {
  $v.value.$touch();

  if (!(await $v.value.$validate())) {
    return;
  }

  const success = await userStore.login({
    email: credentials.email,
    password: credentials.password
  });

  if (!success) {
    $modal.open({ message: $messages.error.message.invalidAuth() });
    return resetForm();
  }

  router.push({ path: route.query?.redirect ?? '/' });
};

const $v = useVuelidate(
  {
    email: {
      required,
      format: email
    },
    password: {
      required
    }
  },
  credentials
);
</script>

<style lang="scss" scoped>
.main-content {
  height: 600px;

  .credential-section {
    display: flex;
    flex-direction: column;
    row-gap: 10px;

    .forgot-password {
      margin: 0;
      cursor: pointer;
    }
  }
}

.main-content.mobile {
  height: auto;

  & > * {
    margin-top: 0;
  }
}
</style>
