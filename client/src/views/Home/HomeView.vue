<template>
  <custom-header searchBox @search="search" />
  <div class="main-content">
    <div class="content-section">
      <div class="content-label">{{ $messages.title.categories() }}</div>
      <custom-mini-item-carousel
        :items="categories"
        labelField="name"
        @select-item="goToCategory"
      />
    </div>
    <div class="content-section">
      <div class="content-label">{{ $messages.title.brands() }}</div>
      <custom-mini-item-carousel :items="brands" labelField="name" @select-item="goToBrand" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $repositories = inject('repositories');
const $messages = inject('messages');

const categories = ref([]);
const brands = ref([]);

onMounted(async () => {
  const [categoryResults, brandResults] = await Promise.all([
    $repositories.categoryRepository.getAll({}),
    $repositories.brandRepository.getAll({})
  ]);

  categories.value = categoryResults?.data?.data?.results ?? [];
  brands.value = brandResults?.data?.data?.results ?? [];

  await getProducts();
});

async function getProducts() {
  await $repositories.productRepository.getAll({});
}

async function search(value) {
  await $repositories.productRepository.getAll({ search: value }).then(({ data: { data } }) => {
    console.log(data);
  });
}

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}

function goToBrand(item) {
  router.push({ name: 'ProductBrand', params: { brandId: item.brandId } });
}
</script>

<style lang="scss"></style>
