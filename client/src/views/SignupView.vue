<template>
  <custom-header>
    <template #right-content> Sign Up </template>
  </custom-header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
</script>