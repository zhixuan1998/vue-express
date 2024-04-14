<template>
  <div class="content-section">
    <div class="content-label">{{ $messages.title.categories() }} - {{ category?.name || '' }}</div>
    <custom-mini-item-carousel :items="categories" labelField="name" @select-item="goToCategory" />
  </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');
const $messages = inject('messages');

const categories = ref([]);

onMounted(async () => {
  const categoryResults = await $repositories.categoryRepository.getAll({});
  categories.value = categoryResults?.data?.data?.results ?? [];
});

const category = computed(() =>
  categories.value.find((o) => o.categoryId === route.params.categoryId)
);

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}
</script>
