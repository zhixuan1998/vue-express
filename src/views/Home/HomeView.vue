<template>
  <product-listing>
    <div v-show="categories.length" class="carousel-section">
      <div class="section-title">{{ $messages.title.categories() }}</div>
      <custom-mini-item-carousel
        :items="categories"
        labelField="name"
        @select-item="goToCategory"
      />
    </div>
    <div v-show="brands.length" class="carousel-section">
      <div class="section-title">{{ $messages.title.brands() }}</div>
      <custom-mini-item-carousel :items="brands" labelField="name" @select-item="goToBrand" />
    </div>
  </product-listing>
</template>

<script setup>
import { ProductListing } from '@/layouts';
import { ref, onBeforeMount, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const $messages = inject('messages');
const $repositories = inject('repositories');

const categories = ref([]);
const brands = ref([]);

onBeforeMount(async () => {
  const [categoriesResult, brandsResult] = await Promise.all([
    $repositories.categoryRepository.getAll({}),
    $repositories.brandRepository.getAll({})
  ]);

  categories.value = categoriesResult?.data?.data?.results ?? [];
  brands.value = brandsResult?.data?.data?.results ?? [];
})

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}

function goToBrand(item) {
  router.push({ name: 'ProductBrand', params: { brandId: item.brandId } });
}
</script>