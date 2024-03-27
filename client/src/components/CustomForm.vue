<template>
  <div class="form-container" :class="{ mobile: isMobile }">
    <div class="top-section">
      <div class="title">{{ title }}</div>
      <div class="description">{{ description }}</div>
    </div>
    <custom-separator />
    <div class="body-section">
      <slot name="body-section"></slot>
    </div>
  </div>
</template>

<script setup>
import { useMediaQuery } from '../hooks';

const props = defineProps({
  title: String,
  description: String,
  maxWidth: {
    type: String,
    default: '550px'
  }
});

const isMobile = useMediaQuery({ maxWidth: props.maxWidth });
</script>

<style lang="scss">
.form-container {
  width: min(100%, v-bind(maxWidth));
  height: auto;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.14);
  color: var(--theme-color-xl);

  .top-section {
    .title {
      font-size: 20px;
    }

    .description {
      color: rgba(36, 32, 104, 0.5);
      font-weight: 600;
    }
  }

  & > *:not(.body-section),
  .body-section > * {
    padding-left: 30px;
    padding-right: 30px;
  }

  .top-section,
  .body-section > *:not(.separator) {
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .top-section,
  .body-section,
  .body-section > * {
    width: 100%;
  }
}

.form-container.mobile {
  border-radius: 0;
}
</style>