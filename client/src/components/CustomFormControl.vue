<template>
  <div class="input-container">
    <div class="main" :class="{ 'vertical-layout': verticalLayout }">
      <label class="label">{{ label }}</label>
      <div class="input-wrapper">
        <input class="input" v-model="modelValue" :type="inputType" :readonly="readonly" />
        <div class="password-toggler">
          <font-awesome-icon
            v-if="isPassword"
            :icon="showPassword ? faEye : faEyeSlash"
            @click="togglePassword"
          />
        </div>
      </div>
    </div>
    <div v-if="slots['error-messages']" class="error-messages">
      <slot name="error-messages"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, useSlots } from 'vue';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const modelValue = defineModel();
const slots = useSlots();

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: 'Label'
  },
  verticalLayout: Boolean,
  readonly: Boolean
});

const isPassword = ref(props.type === 'password');
const showPassword = ref(false);
const inputType = ref(props.type);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  inputType.value = showPassword.value ? 'text' : 'password';
};
</script>

<style lang="scss">
.input-container {
  .main {
    display: flex;
    color: var(--theme-color-xl);

    &.vertical-layout {
      flex-direction: column;
    }

    &:not(.vertical-layout) {
      .label {
        text-align: right;
      }
    }

    &.vertical-layout {
      .label {
        margin-bottom: 5px;
      }
    }

    .label {
      min-width: 100px;
      margin-right: 15px;
      margin-bottom: 15px;
    }

    .input-wrapper {
      display: flex;
      height: 30px;
      flex-grow: 1;
      border: 1px solid rgba(36, 32, 104, 0.2);

      &:has(.input:focus) {
        border-color: rgba(36, 32, 104, 0.6);
      }

      .input {
        flex-grow: 1;
        width: 100;
        border: 0;
        transition: 0.25s;
        padding-left: 10px;

        &:focus {
          outline: none;
        }
      }

      .password-toggler {
        width: 35px;
        display: flex;

        svg {
          margin: auto;
        }
      }
    }
  }

  .error-messages {
    color: rgb(255, 0, 0, 0.85);

    .error-message-item {
      margin: 5px 0 0 0;
    }
  }
}
</style>