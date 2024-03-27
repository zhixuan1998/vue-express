<template>
  <div class="item">
    <router-link to="/user/purchase">user</router-link>
  </div>
  <div class="item">
    <router-link to="/cart">
      <font-awesome-icon :icon="faCartShopping" />
    </router-link>
  </div>
</template>
  
<script setup>
import { inject } from 'vue';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const $repositories = inject('repositories');
</script>
  
<style lang="scss" scoped>
</style>