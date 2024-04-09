<template>
  <custom-header searchBox />
  <div class="main-content">
    <div class="content-section">
      <div class="content-label">CATEGORIES</div>
      <custom-mini-item-carousel :items="categories" labelField="name" />
    </div>
    <!-- <div class="content-section">
      <div class="content-label">CATEGORIES</div>
      <custom-mini-item-carousel :items="categories" labelField="name" />
    </div> -->
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';

const $repositories = inject('repositories');

const categories = ref([]);

onMounted(async () => {
  await getCategories();
});

async function getCategories() {
  await $repositories.categoryRepository.getAll().then(({ data: { data } }) => {
    categories.value = data.results;
  });
}
</script>

<style lang="scss"></style>
