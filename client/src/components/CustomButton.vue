<template>
  <button class="button" :class="color">{{ text }}</button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  text: {
    type: String,
    default: 'Button'
  }
});
</script>

<style lang="scss" scoped>
.button {
  flex-grow: 1;
  padding: 9px;
  text-align: center;
  border: 1px solid var(--theme-color-l);
  margin-top: 15px;

  &:disabled {
    cursor: not-allowed;
  }

  &.primary {
    color: #ffffff;
    background-color: rgba(185, 165, 254, 1);

    &:disabled,
    &:hover {
      background-color: rgba(185, 165, 254, 0.91);
    }

    &:active:not(:disabled) {
      background-color: rgba(185, 165, 254, 1);
    }
  }

  &.secondary {
    color: var(--theme-color-l);

    &,
    &:disabled {
      background-color: rgba(36, 32, 104, 0);
    }

    &:hover:not(:disabled) {
      background-color: rgba(36, 32, 104, 0.03);
    }

    &:active:not(:disabled) {
      background-color: rgba(36, 32, 104, 0.06);
    }
  }
}
</style>

