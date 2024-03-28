<template>
  <div class="separator" :class="{ fully: fully }" :style="{ marginBottom: text ? '-18px' : 0 }">
    <div class="left"></div>
    <div v-if="text" class="text">{{ text }}</div>
    <div class="right"></div>
  </div>
</template>

<script setup>
defineProps({
  fully: Boolean,
  text: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss">
.separator {
  width: 100%;
  display: flex;

  .left,
  .right {
    flex-grow: 1;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.15);
  }

  .left {
    grid-area: left;
  }

  .right {
    grid-area: right;
  }

  .text {
    grid-area: text;
    padding: 0 16px;
    transform: translateY(-50%);
    color: rgba(36, 32, 104, 0.5);
  }

  &:not(.fully) > * {
    background-clip: content-box;
  }
}
</style>