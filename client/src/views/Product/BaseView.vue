<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" ref="headerRef" />
  <div class="main-content">
    <router-view v-bind="routerViewProps" @update="clearInput"> </router-view>
    <custom-listing-section :minItemWidthInPx="132.5" :gapWidthInPx="5">
      <div v-for="item of products" class="item" :key="item.productId">
        <div class="item-image">
          <img :src="item.imageUrl ?? DEFAULT_IMAGE_URL" onerror="this.src=DEFAULT_IMAGE_URL" />
        </div>
        <div class="item-content">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-price">RM{{ item.unitPrice }}</span>
        </div>
      </div>
    </custom-listing-section>
    <custom-infinite-loading :loaded="enableInfiniteLoad" @infinite-loading="infiniteLoad" />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const DEFAULT_IMAGE_URL = 'https://picsum.photos/200';

const SEARCH_AREA_ROUTE_NAME = {
  all: 'Home',
  brand: 'ProductBrand',
  category: 'ProductCategory'
};

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');

let allSearchAreaOptions = [];
const searchAreaOptions = ref([]);
const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const headerRef = ref(null);
const enableInfiniteLoad = ref(false);

onMounted(async () => {
  allSearchAreaOptions = await $repositories.lookupRepository.getSearchProductAreas();
  filterSearchAreaOptions(route.name);

  const [categoryResults, brandResults] = await Promise.all([
    $repositories.categoryRepository.getAll({}),
    $repositories.brandRepository.getAll({})
  ]);

  categories.value = categoryResults?.data?.data?.results ?? [];
  brands.value = brandResults?.data?.data?.results ?? [];

  await getProducts();
  await nextTick();
  enableInfiniteLoad.value = true;
});

const routerViewProps = computed(() => {
  const props = {};

  if (route.name !== 'ProductBrand') {
    props.categories = categories.value;
  }

  if (route.name !== 'ProductCategory') {
    props.brands = brands.value;
  }

  return props;
});

let page = 1;

const productFilter = computed(() => {
  const {
    query: { search },
    params: { brandId, categoryId }
  } = route;

  const obj = {
    search: search || '',
    brandIds: brandId ? [brandId] : [],
    categoryIds: categoryId ? [categoryId] : [],
    limit: 30
  };

  return obj;
});

watch(productFilter, async () => getProducts());

async function getProducts() {
  const filter = { ...productFilter.value, page: 1 };

  products.value = [];
  page = 1;

  await $repositories.productRepository.getAll(filter).then(({ data: { data } }) => {
    products.value = data?.results ?? [];
  });
}

async function infiniteLoad($state) {
  const filter = { ...productFilter.value, page: ++page };

  await $repositories.productRepository
    .getAll(filter)
    .then(({ data: { data } }) => {
      products.value = [...products.value, ...(data?.results ?? [])];
    })
    .catch(() => {
      $state.error();
    });
}

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

function clearInput() {
  headerRef?.value.searchBoxRef?.clearInput();
}
</script>
