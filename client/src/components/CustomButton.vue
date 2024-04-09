<template>
  <button class="custom-button" :class="color"><slot></slot></button>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'primary'
  }
});
</script>

<style lang="scss" scoped>
.custom-button {
  flex-grow: 1;
  padding: 9px 36px;
  text-align: center;
  border: 1px solid var(--theme-color-l);

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
