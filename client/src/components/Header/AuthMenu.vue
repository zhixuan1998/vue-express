<template>
  <div class="item">
    <router-link :to="`/login?redirect=${route.fullPath}`">LOGIN</router-link>
  </div>
  <div class="item">
    <router-link :to="`/signup?redirect=${route.fullPath}`">SIGNUP</router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style lang="scss" scoped>
</style>