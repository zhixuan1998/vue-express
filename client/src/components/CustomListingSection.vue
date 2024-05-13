<template>
  <div class="listing-section" ref="sectionEl">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

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

const sectionEl = ref(null);
let resizeObserver = null;

let itemWidth = ref(0);
const minItemWidth = `${props.minItemWidthInPx}px`;
const gapWidth = `${props.gapWidthInPx}px`;

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width: sectionWidth } = entry.contentRect;
      let columnCount = Math.floor(sectionWidth / props.minItemWidthInPx);
      let totalGapWidth = props.gapWidthInPx * (columnCount - 1);
      const getItemWidth = () => (sectionWidth - totalGapWidth) / columnCount;
      if (getItemWidth() < props.minItemWidthInPx) {
        columnCount -= 1;
        totalGapWidth -= props.gapWidthInPx;
      }
      itemWidth.value = `${getItemWidth()}px`;
    }
  });
  resizeObserver.observe(sectionEl.value);
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>

<style lang="scss">
.listing-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(v-bind(minItemWidth), 100%), v-bind(itemWidth)));
  gap: v-bind(gapWidth);

  .item {
    margin-bottom: v-bind(gapWidth);
    aspect-ratio: 1 / 1.789;
    background-color: #ffffff;
    transition: translate 0.15s;
    cursor: pointer;
  }
}
</style>
