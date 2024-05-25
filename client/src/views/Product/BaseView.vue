<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" ref="headerRef" />
  <div class="main-content">
    <router-view v-bind="routerViewProps"> </router-view>
    <div v-if="products.length" class="pagination-section">
      <custom-separator />
      <span class="fw-bold">Items per page</span>
      <custom-dropdown v-model="perPage" :options="perPageOptions"></custom-dropdown>
      <custom-separator />
    </div>
    <custom-listing-section :minItemWidthInPx="132.5" :gapWidthInPx="5">
      <div v-for="item of products" class="item" :key="item.productId">
        <div class="item-image">
          <img :src="item.logoUrl ?? DEFAULT_IMAGE_URL" onerror="this.src=DEFAULT_IMAGE_URL" />
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
    <custom-pagination
      v-show="products.length"
      v-model="currentPage"
      :total-pages="totalPages"
      :before-update="getProducts"
      :disabled="isLoading"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, onBeforeMount, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { compareObjectValue } from '@/utils/compare';

const DEFAULT_IMAGE_URL = 'https://picsum.photos/200';

const SEARCH_AREA_ROUTE_NAME = {
  all: 'Home',
  brand: 'ProductBrand',
  category: 'ProductCategory'
};

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');

const initPage = 1;

let perPageOptions = [];
let allSearchAreaOptions = [];
const searchAreaOptions = ref([]);
const currentPage = ref(initPage);
const pagination = ref(null);
const perPage = ref(10);
const brands = ref([]);
const products = ref([]);
const categories = ref([]);
const headerRef = ref(null);

const isLoading = ref(false);

onBeforeMount(async () => {
  allSearchAreaOptions = await $repositories.lookupRepository.getSearchProductAreas();
  filterSearchAreaOptions(route.name);

  const [perPageOptionsResult, categoriesResult, brandsResult] = await Promise.all([
    $repositories.lookupRepository.getRecordPerPageOptions(),
    $repositories.categoryRepository.getAll({}),
    $repositories.brandRepository.getAll({})
  ]);

  perPageOptions = perPageOptionsResult;
  categories.value = categoriesResult?.data?.data?.results ?? [];
  brands.value = brandsResult?.data?.data?.results ?? [];

  await getProducts(initPage);
});

const routerViewProps = computed(() => {
  const props = {};

  if (route.name !== 'ProductBrand') {
    props.categories = categories.value;
  }

  if (route.name === 'ProductBrand') {
    props.brand = brand.value;
  }

  if (route.name === "Home") {
    props.brands = brands.value;
  }

  return props;
});

const brand = computed(() => brands.value.find((r) => r.brandId === route.params.brandId));

const totalPages = computed(() =>
  pagination.value?.totalItems ? Math.ceil(pagination.value.totalItems / perPage.value) : 0
);

watch(
  [() => route.query, () => route.params, perPage],
  async ([, newParams, newPerPage], [, oldParams, oldPerPage]) => {
    const paramChanged = !compareObjectValue(oldParams, newParams);
    const perPageChanged = paramChanged || oldPerPage !== newPerPage;

    if (paramChanged) {
      clearInput();
    }

    if (paramChanged || perPageChanged) {
      currentPage.value = 1;
    }

    await getProducts(currentPage.value);
  }
);

function getProductFilter() {
  const { search } = route.query;
  const { brandId, categoryId } = route.params;

  return {
    search: search || '',
    brandIds: brandId ? [brandId] : [],
    categoryIds: categoryId ? [categoryId] : [],
    limit: perPage.value * 1
  };
}

async function getProducts(page) {
  const filter = getProductFilter();
  filter.page = page;

  isLoading.value = true;

  await $repositories.productRepository
    .getAll(filter)
    .then(async ({ data: { data } }) => {
      products.value = data?.results ?? [];
      pagination.value = data.pagination;
    })
    .finally(() => {
      isLoading.value = false;
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
.pagination-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  margin: 5px 0;
  gap: 10px;

  .custom-dropdown {
    height: 35px;

    .dropdown-container {
      border: 1px solid func.theme-color(l);
      background-color: #fff;
    }
  }
}
.loading-indicator {
  display: flex;
  justify-content: center;
  .spinner-border {
    color: func.theme-color(xl, 0.5);
  }
}
</style>
