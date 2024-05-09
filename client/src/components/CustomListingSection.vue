<template>
  <div class="listing-section">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  minItemWidthInPx: {
    type: Number,
    default: 200
  },
  gapWidthInPx: {
    type: Number,
    default: 10
  }
});

const gapWidth = `${props.gapWidthInPx}px`;
const itemWidth = `${props.minItemWidthInPx}px`;
</script>

<style lang="scss">
.listing-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(v-bind(itemWidth), 1fr));
  gap: v-bind(gapWidth);

  .item {
    aspect-ratio: 1 / 1.789;
    background-color: #ffffff;
    transition: translate 0.15s;
    cursor: pointer;
  }
}
</style>
