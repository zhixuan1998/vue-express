<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" />
  <div class="main-content">
    <router-view></router-view>
    <custom-listing-section :minItemWidthInPx="132.5" :gapWidthInPx="5">
      <div v-for="(item, i) of products" class="item" :key="item.productId">
        <div class="item-image">
          <img
            :src="`https://picsum.photos/id/${i + 300}/200/200`"
            onerror="this.src='https://picsum.photos/200'"
          />
        </div>
        <div class="item-content">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">RM{{ item.unitPrice }}</span>
        </div>
      </div>
    </custom-listing-section>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const SEARCH_AREA_ROUTE_NAME = {
  product: 'Product',
  brand: 'ProductBrand',
  category: 'ProductCategory'
};

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');

let allSearchAreaOptions = [];
const searchAreaOptions = ref([]);
const products = ref([]);

onMounted(async () => {
  allSearchAreaOptions = await $repositories.lookupRepository.getSearchProductAreas();
  filterSearchAreaOptions(route.name);
  getProducts();
});

const productFilter = computed(() => {
  const {
    query: { search },
    params: { brandId, categoryId }
  } = route;

  const obj = {
    search: search || '',
    brandIds: brandId ? [brandId] : [],
    categoryIds: categoryId ? [categoryId] : [],
    limit: 30,
    page: 1
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
  router.push({
    name: SEARCH_AREA_ROUTE_NAME[searchArea],
    params: route.params ?? {},
    query: { search: encodeURI(value) }
  });
}

async function getProducts() {
  await $repositories.productRepository.getAll(productFilter.value).then(({ data: { data } }) => {
    products.value = data?.results ?? [];
  });
}
</script>
