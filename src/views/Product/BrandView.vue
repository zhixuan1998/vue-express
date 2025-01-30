<template>
  <product-listing :search-area-options="searchAreaOptions"></product-listing>
</template>

<script setup>
import { ProductListing } from '@/layouts';
import { ref, onBeforeMount, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const $messages = inject('messages');
const $repositories = inject('repositories');

const brand = ref(null);
const searchAreaOptions = ref([]);

onBeforeMount(async () => {
  const [searchAreasResult, brandsResult] = await Promise.all([
    $repositories.lookupRepository.getSearchProductAreas(),
    $repositories.brandRepository.getAll({ brandIds: [route.params.brandId] })
  ]);

  searchAreaOptions.value = searchAreasResult.filter((o) => o.key !== 'category');
  brand.value = brandsResult?.data?.data?.results?.[0] ?? null;
})
</script>

<style lang="scss"></style>