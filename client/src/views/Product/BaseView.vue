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
const page = ref(1);
const searchAreaOptions = ref([]);
const products = ref([]);
const categories = ref([]);
const brands = ref([]);
const headerRef = ref(null);
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
  async ([newQuery, newParams, newPage]) => {
    const { search } = newQuery;
    const { brandId, categoryId } = newParams;

    page.value = productFilter.page === newPage ? 1 : newPage;

    productFilter.search = search || '';
    productFilter.brandIds = brandId ? [brandId] : [];
    (productFilter.categoryIds = categoryId ? [categoryId] : []), (productFilter.page = page.value);

    await getProducts();
  },
  { immediate: true }
);

async function getProducts() {
  await $repositories.productRepository
    .getAll(productFilter)
    .then(async ({ data: { data } }) => {
      const results = data?.results ?? [];
      products.value = page.value === 1 ? results : [...products.value, ...results];

      await nextTick();
      enableInfiniteLoad.value = data.pagination.isLastPage ? false : true;
      console.log(enableInfiniteLoad.value);
    })
    .catch(() => infiniteLoadRef.value.pause());
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
