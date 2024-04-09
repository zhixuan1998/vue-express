<template>
  <div class="item">
    <router-link to="/user/purchase"
      >{{ userStore.user.lastName }} {{ userStore.user.firstName }}</router-link
    >
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
import { useUserStore } from '../../stores';

const $repositories = inject('repositories');

const userStore = useUserStore();
</script>

<style lang="scss" scoped></style>
