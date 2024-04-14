<template>
  <div class="container form-container" :class="{ mobile: isMobile }">
    <div v-if="header" class="top-section">
      <div class="title">{{ header.title }}</div>
      <div class="description">{{ header.description }}</div>
    </div>
    <custom-separator v-if="header" />
    <div class="body-section">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { useMediaQuery } from '../hooks';

const props = defineProps({
  header: Object,
  maxWidth: {
    type: String,
    default: '550px'
  }
});

const [isMobile] = useMediaQuery([{ maxWidth: props.maxWidth }]);

</script>

<style lang="scss">
.form-container {
  max-width: v-bind(maxWidth);
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

  @media (width > 400px) {
    & > .top-section,
    .body-section > *:not(.separator) {
      padding-left: 30px;
      padding-right: 30px;
    }

    & .separator .left {
      padding-left: 30px;
    }

    & .separator .right {
      padding-right: 30px;
    }
  }

  .top-section,
  .body-section > *:not(.separator) {
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .top-section,
  .body-section {
    width: 100%;
  }

  .body-section > *:not(.separator) {
    display: flex;
    flex-direction: column;
    row-gap: 22px;
  }
}

.form-container.mobile {
  border-radius: 0;
}
</style>
