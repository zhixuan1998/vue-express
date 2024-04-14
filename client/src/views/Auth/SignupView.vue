<template>
  <div class="main-content">
    <custom-form
      :header="{ title: 'Sign Up', description: 'Please fill up the registration form' }"
      :maxWidth="maxWidth"
    >
      <div>
        <div class="row">
          <custom-form-control
            class="col-sm-6"
            v-model:input="user.firstName"
            :label="$messages.label.firstName()"
            verticalLayout
          >
            <template v-if="$v.firstName.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.firstName.required.$invalid"
                :message="$messages.validations.required()"
              />
            </template>
          </custom-form-control>

          <custom-form-control
            class="col-sm-6"
            v-model:input="user.lastName"
            :label="$messages.label.lastName()"
            verticalLayout
          >
            <template v-if="$v.firstName.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.lastName.required.$invalid"
                :message="$messages.validations.required()"
              />
            </template>
          </custom-form-control>
        </div>

        <div class="row">
          <custom-form-control
            class="col-sm-6"
            v-model:input="user.email"
            :label="$messages.label.email()"
            verticalLayout
          >
            <template v-if="$v.email.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.email.required.$invalid"
                :message="$messages.validations.required()"
              />
            </template>
          </custom-form-control>

          <custom-form-control
            class="col-sm-6"
            v-model:prepend="user.phoneCode"
            v-model:input="user.phoneNumber"
            :options="phoneCodes"
            :label="$messages.label.phoneNumber()"
            :prepend-dropdown="{
              keyField: 'phoneCode',
              valueField: (item) => `${item.phoneCode} - ${item.name}`,
              displayField: 'phoneCode'
            }"
            verticalLayout
          >
            <template v-if="$v.phoneNumber.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.phoneNumber.required.$invalid"
                :message="$messages.validations.required()"
              >
                {{ $messages.validations.required() }}
              </custom-error-message>
            </template>
          </custom-form-control>
        </div>

        <div class="row">
          <custom-form-control
            v-model:input="user.dob"
            actualType="calendar"
            :label="$messages.label.dob()"
            verticalLayout
          />
        </div>

        <div class="row">
          <custom-form-control
            class="col-sm-6"
            v-model:input="user.password"
            actualType="password"
            :label="$messages.label.password()"
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

          <custom-form-control
            class="col-sm-6"
            v-model:input="user.confirmPassword"
            actualType="password"
            :label="$messages.label.confirmPassword()"
            :maxLength="20"
            :readonly="user.password === ''"
            verticalLayout
          >
            <template v-if="$v.confirmPassword.$dirty" #error-messages>
              <custom-error-message
                v-if="$v.confirmPassword.required.$invalid"
                :message="$messages.validations.required()"
              />
            </template>
          </custom-form-control>
        </div>
        <custom-button style="margin-top: 15px" @click="signup">{{
          $messages.button.signup()
        }}</custom-button>
      </div>

      <custom-separator text="OR" />
      <div></div>
    </custom-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { useRoute, useRouter } from 'vue-router';
import { required, requiredIf, email } from '@vuelidate/validators';

import { useUserStore } from '../../stores';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const $messages = inject('messages');
const $repositories = inject('repositories');

const user = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phoneCode: '+60',
  phoneNumber: '',
  dob: '',
  password: '',
  confirmPassword: ''
});
const phoneCodes = ref([]);

onMounted(async () => {
  getCountryPhoneCodes();
});

async function getCountryPhoneCodes() {
  await $repositories.lookupRepository.getCountryPhoneCodes().then(
    ({
      data: {
        data: { results }
      }
    }) => {
      phoneCodes.value = results;
    }
  );
}

async function signup() {
  $v.value.$touch();

  if (!(await $v.value.$validate())) {
    return;
  }

  const { confirmPassword, dob, ...signupData } = user;

  const result = await userStore.register({
    ...signupData,
    dob: new Date(dob).toISOString()
  });

  if (result) {
    router.push({
      name: 'ThankYou',
      query: route.query?.redirect ? { redirect: route.query.redirect } : {}
    });
  }
}

const $v = useVuelidate(
  {
    firstName: {
      required
    },
    lastName: {
      required
    },
    email: {
      required,
      format: email
    },
    phoneNumber: {
      required,
      format: () => true
    },
    dob: {
      required
    },
    // gender: {
    //   required
    // },
    password: {
      required,
      format: (value) =>
        !value ||
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/.test(value)
    },
    confirmPassword: {
      required: requiredIf(user.password),
      match: (value) => !value || value === user.password
    }
  },
  user
);

const maxWidth = '800px';
</script>

<style scoped>
.main-content {
  height: auto;
  min-height: 600px;
}
.row {
  row-gap: 22px;
}
</style>
