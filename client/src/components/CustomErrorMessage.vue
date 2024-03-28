<template>
  <div class="error-message-item">
    <font-awesome-icon class="icon" :icon="faTriangleExclamation" />
    <p class="message">{{ message }}</p>
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
  align-items: center;

  .icon {
    margin-right: 5px;
  }

  .message {
    flex-grow: 1;
    margin: 0;
    font-weight: 500;
  }
}
</style>
