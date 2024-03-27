<template>
  <div class="search_box-container">
    <input
      class="input"
      v-model="modelValue"
      :readonly="readonly"
      :placeholder="placeholder"
      @keyup="
        {
          if ($event.keyCode === 13) search();
        }
      "
    />
    <div class="icon-wrapper" @click="search">
      <font-awesome-icon :icon="faSearch" />
    </div>
  </div>
</template>

<script setup>
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const modelValue = defineModel();
const emits = defineEmits(['search']);

defineProps({
  placeholder: {
    type: String,
    default: 'Search'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  }
});

function search() {
  if (modelValue.value) {
    emits('search', modelValue.value);
  }
}
</script>


<style lang="scss" scoped>
.search_box-container {
  --cont-height: 45px;
  --padding: 5px;

  display: flex;
  align-items: center;
  position: relative;
  padding: var(--padding);
  width: v-bind(width);
  height: var(--cont-height);
  overflow: hidden;
  background-color: #ffffff;

  & > * {
    height: calc(var(--cont-height) - (var(--padding) * 2));
  }

  .input {
    padding: 0 0 0 15px;
    width: calc(100% - (var(--padding) * 2));
    border: none;
    font-size: inherit;

    &:focus {
      outline: none;
    }
  }

  .icon-wrapper {
    width: calc(var(--cont-height) * 1.2);
    height: 100%;
    display: flex;
    background-color: var(--theme-color-s);
    cursor: pointer;
    transition-duration: 0.15s;

    svg {
      margin: auto;
      color: var(--theme-color-xl);
      transition-duration: inherit;
    }

    &:active svg {
      scale: 0.85;
    }
  }
}
</style>