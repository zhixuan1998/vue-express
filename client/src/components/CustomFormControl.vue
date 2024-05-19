<template>
  <div class="input-container">
    <div class="main" :class="{ 'vertical-layout': verticalLayout }">
      <label class="label">{{ label }}</label>
      <div class="input-wrapper">
        <custom-dropdown
          v-if="prependDropdown"
          class="custom-dropdown"
          v-model="prependValue"
          :options="options"
          :keyField="prependDropdown.keyField"
          :valueField="prependDropdown.valueField"
          :displayField="prependDropdown.displayField"
          relativeParentClass="input-wrapper"
          searchable
          hideDropdownIcon
        />
        <div class="input-field">
          <flat-pickr v-if="isCalendar" v-model="inputValue" />
          <input
            v-else
            v-model="inputValue"
            :type="currentType"
            :maxlength="maxLength"
            :readonly="readonly"
          />
          <div v-if="isPassword" class="password-toggler">
            <font-awesome-icon :icon="showPassword ? faEye : faEyeSlash" @click="togglePassword" />
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
    <div v-if="slots['error-messages']" class="error-messages">
      <slot name="error-messages"></slot>
    </div>
  </div>
</template>

<script setup>
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { ref, useSlots } from 'vue';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const defaultType = 'text';
const validTypes = [defaultType, 'password', 'number', 'calendar'];

const inputValue = defineModel('input');
const prependValue = defineModel('prepend');

const slots = useSlots();

const props = defineProps({
  actualType: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: 'Label'
  },
  maxLength: {
    type: Number,
    default: 255
  },
  prependDropdown: {
    type: Object,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  searchable: Boolean,
  verticalLayout: Boolean,
  readonly: Boolean
});

const isPassword = ref(props.actualType === 'password');
const isCalendar = ref(props.actualType === 'calendar');

const showPassword = ref(false);
const currentType = ref(validTypes.includes(props.actualType) ? props.actualType : defaultType);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
  currentType.value = showPassword.value ? 'text' : 'password';
};
</script>

<style lang="scss">
.input-container {
  .main {
    display: flex;
    color: func.theme-color(xl);

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

      .custom-dropdown {
        width: 70px;

        .dropdown-container {
          background-color: func.theme-color(xs);
          border: 1px solid #{func.theme-color(l, 0.3)};

          .dropdown-opener div {
            justify-content: center;
          }

          &:has(.dropdown-opener:focus) {
            border-color: func.theme-color(l, 0.6);
          }

          &:has(.dropdown-opener:not(:focus)) {
            border-right-color: func.theme-color(l, 0.3);
          }
        }
      }

      .input-field {
        display: flex;
        flex-grow: 1;
        height: 100%;
        border: 1px solid #{func.theme-color(l, 0.3)};

        &:has(input:focus) {
          border-color: rgba(36, 32, 104, 0.6);
        }

        input {
          flex-grow: 1;
          height: 100%;
          transition: 0.25s;
          padding-left: 10px;
          border: none;

          &:focus {
            outline: none;
          }
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
    display: flex;
    flex-direction: column;
    row-gap: 5px;

    &:not(:empty) {
      margin-top: 5px;
    }
  }
}
</style>
