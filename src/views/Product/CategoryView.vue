<template>
  <product-listing :search-area-options="searchAreaOptions">
    <div class="carousel-section" v-show="categories.length">
      <div class="section-title">
        {{ $messages.title.categories() }} - {{ category?.name || '' }}
      </div>
      <custom-mini-item-carousel
        :items="categories"
        labelField="name"
        @select-item="goToCategory"
      />
    </div>
  </product-listing>
</template>

<script setup>
import { ProductListing } from '@/layouts';
import { ref, watch, onBeforeMount, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $messages = inject('messages');
const $repositories = inject('repositories');

const category = ref(null);
const categories = ref([]);
const searchAreaOptions = ref([]);

onBeforeMount(async () => {
  const [searchAreasResult, categoriesResult] = await Promise.all([
    $repositories.lookupRepository.getSearchProductAreas(),
    $repositories.categoryRepository.getAll({})
  ]);

  searchAreaOptions.value = searchAreasResult.filter((o) => o.key !== 'brand');
  categories.value = categoriesResult?.data?.data?.results ?? [];

  setCategory();
});

watch(
  () => route.params.categoryId,
  () => setCategory()
);

function setCategory() {
  category.value = categories.value.find((o) => o.categoryId === route.params.categoryId);
}

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}
</script>
