<template>
  <button class="custom-button" :class="color" :disabled="disabled"><slot></slot></button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  },
  disabled: Boolean
});
</script>

<style lang="scss" scoped>
// functions

.custom-button {
  flex-grow: 1;
  padding: 9px 36px;
  text-align: center;
  border: 1px solid #{func.theme-color(l)};

  &:disabled {
    cursor: not-allowed;
  }

  &.primary {
    color: #ffffff;

    &:disabled,
    &:hover {
      background-color: func.theme-color(l, 0.9);
      border-color: func.theme-color(l, 0.9);
    }

    &,
    &:active:not(:disabled) {
      background-color: func.theme-color(l);
    }
  }

  &.secondary {
    &,
    &:disabled {
      background-color: func.theme-color(xs, 0.3);
    }

    &:hover:not(:disabled) {
      background-color: func.theme-color(xs, 0.6);
    }

    &:active:not(:disabled) {
      background-color: func.theme-color(xs);
    }
  }
}
</style>
