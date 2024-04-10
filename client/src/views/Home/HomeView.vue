<template>
  <custom-header searchBox />
  <div class="main-content">
    <div class="content-section">
      <div class="content-label">{{ $messages.title.categories() }}</div>
      <custom-mini-item-carousel :items="categories" labelField="name" />
    </div>
    <div class="content-section">
      <div class="content-label">{{ $messages.title.brands() }}</div>
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
  const [categoryResults, brandResults] = await Promise.all([
    $repositories.categoryRepository.getAll(),
    $repositories.brandRepository.getAll()
  ]);

  categories.value = categoryResults?.data?.data?.results ?? [];
  brands.value = brandResults?.data?.data?.results ?? [];

  await getProducts();
});

async function getProducts() {
  await $repositories.productRepository.getAll({});
}
</script>

<style lang="scss"></style>
