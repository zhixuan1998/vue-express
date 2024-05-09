<template>
  <div v-if="loaded" class="d-flex justify-content-center" ref="infiniteLoadRef">
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const emits = defineEmits(['infinite-loading']);

const props = defineProps({
  loaded: Boolean,
  threshold: {
    type: Number,
    default: 0.5
  }
});

const infiniteLoadRef = ref(null);
let observer = null;

let state = {
  loaded: observe,
  complete: disconnectObserver,
  error: unobserve
};

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
  },
  { once: true }
);

function initObserver() {
  let callback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio >= props.threshold) {
        entryCallback();
      }
    });
  };

  let options = {
    threshold: props.threshold >= 0 && props.threshold <= 1 ? props.threshold : 1
  };

  observer = new IntersectionObserver(callback, options);
  observe();
}

function entryCallback() {
  emits('infinite-loading', state);
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
</script>

<style scoped>
.spinner-border {
  color: var(--theme-color-xl-50);
}
</style>