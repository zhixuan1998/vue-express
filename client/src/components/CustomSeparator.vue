<template>
  <div class="separator" :class="{ fully: fully }"></div>
</template>

<script setup>
defineProps({
  fully: Boolean
});
</script>

<style lang="scss">
.separator {
  width: 100%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.15);

  &:not(.fully) {
    background-clip: content-box;
  }
}
</style>