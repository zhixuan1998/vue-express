<template>
  <div v-if="loaded" ref="infiniteLoadRef"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const emits = defineEmits(['infinite-loading']);

const props = defineProps({
  loaded: Boolean
});

const infiniteLoadRef = ref(null);
let observer = null;

onMounted(() => {
  if (props.loaded) initObserver();
});

watch(
  () => props.loaded,
  async (loaded) => {
    if (loaded) {
      await nextTick();
      initObserver();
    }
  }
);

function initObserver() {
  let callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= 1) {
        entryCallback();
      }
    });
  };

  observer = new IntersectionObserver(callback, { threshold: 1 });
  observe();
}

function entryCallback() {
  emits('infinite-loading');
}

function observe() {
  if (infiniteLoadRef.value) observer.observe(infiniteLoadRef.value);
}

function unobserve() {
  if (infiniteLoadRef.value) observer.unobserve(infiniteLoadRef.value);
}

function disconnectObserver() {
  if (observer) observer.disconnect();
}

onBeforeUnmount(() => {
  disconnectObserver();
});

defineExpose({
  loaded: observe,
  pause: unobserve,
  stop: disconnectObserver
});
</script>

<style lang="scss" scoped>
.spinner-border {
  color: func.theme-color(xl, 0.5);
}
</style>
