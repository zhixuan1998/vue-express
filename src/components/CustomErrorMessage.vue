<template>
  <div class="error-message-item">
    <font-awesome-icon v-if="showIcon" class="icon" :icon="faTriangleExclamation" />
    <span class="message">{{ message }}</span>
  </div>
</template>

<script setup>
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
defineProps({
  showIcon: Boolean,
  message: {
    type: String,
    default: ''
  }
});
</script>
<style lang="scss" scoped>
.error-message-item {
  display: flex;
  font-size: 12px;
  color: rgb(255, 0, 0, 0.85);

  .icon {
    margin-right: 10px;
    margin-top: 0.25em;
  }

  .message {
    flex-grow: 1;
    margin: 0;
    font-weight: 500;
    color: rgb(255, 0, 0, 0.85);
  }
}
</style>
