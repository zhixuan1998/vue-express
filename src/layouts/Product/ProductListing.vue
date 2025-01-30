<template>
  <custom-header searchBox :searchOptions="searchAreaOptions" @search="search" />
  <div class="main-content">
    <slot></slot>
    <div v-if="products.length" class="pagination-section">
      <custom-separator />
      <span class="fw-bold">Items per page</span>
      <custom-dropdown v-model="perPage" :options="perPageOptions"></custom-dropdown>
      <custom-separator />
    </div>
    <custom-listing-section :minItemWidthInPx="132.5" :gapWidthInPx="5">
      <div v-for="item of products" class="item" :key="item.productId">
        <div class="item-image">
          <img :src="item.logoUrl ?? FALLBACK_IMAGE_URL" onerror="this.src=FALLBACK_IMAGE_URL" />
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
import { ref, computed, inject, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { compareObjectValue } from '@/utils/compare';

const FALLBACK_IMAGE_URL = 'https://picsum.photos/200';

const SEARCH_AREA_ROUTE_NAME = {
  all: 'Home',
  brand: 'ProductBrand',
  category: 'ProductCategory'
};

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');

const initPage = 1;

const perPageOptions = ref([]);
const currentPage = ref(initPage);
const pagination = ref(null);
const perPage = ref(10);
const products = ref([]);

const isLoading = ref(false);

const props = defineProps({
  searchAreaOptions: {
    type: Array,
    default: () => []
  }
});

onMounted(async () => {
  const perPageOptionsResult = await $repositories.lookupRepository.getRecordPerPageOptions();

  perPageOptions.value = perPageOptionsResult;

  await getProducts(initPage);
});

const totalPages = computed(() =>
  pagination.value?.totalItems ? Math.ceil(pagination.value.totalItems / perPage.value) : 0
);

watch(
  [() => route.query, () => route.params, perPage],
  async ([, newParams, newPerPage], [, oldParams, oldPerPage]) => {
    const paramChanged = compareObjectValue(newParams, oldParams);
    const perPageChanged = paramChanged || oldPerPage !== newPerPage;

    if (paramChanged) {
      // clearInput();
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
    .then(async ({ data }) => {
      products.value = data?.data?.results ?? [];
      pagination.value = data?.data?.pagination;
    })
    .finally(() => {
      isLoading.value = false;
    });
}

async function search(value, searchArea) {
  const name = SEARCH_AREA_ROUTE_NAME[searchArea] ?? SEARCH_AREA_ROUTE_NAME.all;

  const params = {};

  if (props.categoryId) {
    params.categoryId = props.categoryId;
  }

  if (props.brandId) {
    params.brandId = props.brandId;
  }

  router.push({
    name,
    params,
    query: { search: encodeURI(value) }
  });
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
