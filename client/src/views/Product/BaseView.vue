<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" ref="headerRef" />
  <div class="main-content">
    <router-view v-bind="routerViewProps"> </router-view>
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
    <div v-show="isLoading" class="loading-indicator">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <custom-infinite-loading
      :loaded="enableInfiniteLoad"
      @infinite-loading="infiniteLoad"
      ref="infiniteLoadRef"
    />
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
const brands = ref([]);
const products = ref([]);
const categories = ref([]);
const headerRef = ref(null);

const page = ref(1);
const isLoading = ref(false);
const infiniteLoadRef = ref(null);
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

  // await getProducts();
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

const productFilter = {
  search: '',
  brandIds: [],
  categoryIds: [],
  limit: 30,
  page: 1
};

watch(
  [() => route.query, () => route.params, page],
  async ([newQuery, newParams, newPage], [, oldParams = {}], onCleanup) => {
    const { search } = newQuery;
    const { brandId: newBrandId, categoryId: newCategoryId } = newParams;
    const { brandId: oldBrandId, categoryId: oldCategoryId } = oldParams;

    if (oldBrandId !== newBrandId || oldCategoryId !== newCategoryId) {
      clearInput();
    }

    if (productFilter.page === newPage) {
      enableInfiniteLoad.value = false;
      page.value = 1;
      products.value = [];
    }

    productFilter.search = search || '';
    productFilter.brandIds = newBrandId ? [newBrandId] : [];
    productFilter.categoryIds = newCategoryId ? [newCategoryId] : [];
    productFilter.page = page.value;

    const controller = new AbortController();
    const signal = controller.signal;

    const getProductsRequest = getProducts(signal);

    onCleanup(() => controller.abort());

    await getProductsRequest;
  },
  { immediate: true }
);

async function getProducts(signal) {
  isLoading.value = true;

  await $repositories.productRepository
    .getAll(productFilter, signal)
    .then(async ({ data: { data } }) => {
      products.value = [...products.value, ...(data?.results ?? [])];

      await nextTick();
      enableInfiniteLoad.value = data.pagination.isLastPage ? false : true;

      if (data.pagination.isLastPage) {
        isLoading.value = false;
      }
    })
    .catch(() => {
      isLoading.value = false;
      infiniteLoadRef.value.pause();
    });
}

async function infiniteLoad() {
  page.value += 1;
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
  const name = SEARCH_AREA_ROUTE_NAME[searchArea] ?? SEARCH_AREA_ROUTE_NAME.all;

  router.push({
    name,
    params: route.params ?? {},
    query: { search: encodeURI(value) }
  });
}

function clearInput() {
  headerRef?.value?.searchBoxRef?.clearInput();
}
</script>

<style lang="scss">
.loading-indicator {
  display: flex;
  justify-content: center;

  .spinner-border {
    color: func.theme-color(xl, 0.5);
  }
}
</style>
