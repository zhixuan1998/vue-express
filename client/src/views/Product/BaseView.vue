<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" />
  <div class="main-content">
    <router-view v-model:brandId="brandId" v-model:categoryId="categoryId"></router-view>
  </div>
</template>

<script setup>
import _ from 'lodash';
import { ref, computed, inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');

let allSearchAreaOptions = [];
const searchAreaOptions = ref([]);
const brandId = ref(null);
const categoryId = ref(null);
const products = ref([]);

onMounted(async () => {
  allSearchAreaOptions = await $repositories.lookupRepository.getSearchProductAreas();
  filterSearchAreaOptions(route.name);
});

const productFilter = computed(() => {
  const obj = {
    search: route.query.search || '',
    brandIds: brandId.value ? [brandId.value] : [],
    categoryIds: categoryId.value ? [categoryId.value] : []
  };

  return obj;
});

watch(productFilter, async () => getProducts());

watch(
  () => route.name,
  () => filterSearchAreaOptions(route.name)
);

function filterSearchAreaOptions(routeName) {
  searchAreaOptions.value =
    (routeName === 'ProductCategory' && allSearchAreaOptions.filter((o) => o.key !== 'brand')) ||
    (routeName === 'ProductBrand' && allSearchAreaOptions.filter((o) => o.key !== 'category')) ||
    [];
}

async function search(value, searchArea) {
  if (searchArea === 'product') {
    return router.push({ name: 'Product', query: { search: value } });
  }

  if (searchArea === 'brand') {
    return router.push({ name: 'ProductBrand', params: { brandId: value } });
  }

  if (searchArea === 'category') {
    return router.push({ name: 'ProductCategory', params: { categoryId: value } });
  }
}

function debounceGetProducts() {
  _.debounce(getProducts, 300);
}

async function getProducts() {
  await $repositories.productRepository.getAll(productFilter.value).then(({ data: { data } }) => {
    products.value = data?.results ?? [];
  });
}
</script>
