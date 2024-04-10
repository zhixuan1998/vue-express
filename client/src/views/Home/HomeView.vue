<template>
  <custom-header searchBox />
  <div class="main-content">
    <div class="content-section">
      <div class="content-label">{{ $messages.label.categories() }}</div>
      <custom-mini-item-carousel :items="categories" labelField="name" />
    </div>
    <div class="content-section">
      <div class="content-label">{{ $messages.label.brands() }}</div>
      <custom-mini-item-carousel :items="brands" labelField="name" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';

const $repositories = inject('repositories');
const $messages = inject('messages');

const categories = ref([]);
const brands = ref([]);

onMounted(async () => {
  await getCategories();
  await getBrands();
});

async function getCategories() {
  await $repositories.categoryRepository.getAll().then(({ data: { data } }) => {
    categories.value = data.results;
  });
}

async function getBrands() {
  await $repositories.brandRepository.getAll().then(({ data: { data } }) => {
    brands.value = data.results;
  });
}
</script>

<style lang="scss"></style>
