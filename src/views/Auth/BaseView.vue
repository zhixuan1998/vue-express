<template>
  <custom-header :hasMenu="false">
    <template v-if="$messages.title[route.name]" #right-content>{{
      $messages.title[route.name]()
    }}</template>
  </custom-header>
  <router-view></router-view>
</template>

<script setup>
import { inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const $messages = inject('messages');
</script>
