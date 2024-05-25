<template>
  <div class="carousel-section" v-show="categories.length">
    <div class="section-title">{{ $messages.title.categories() }} - {{ category?.name || '' }}</div>
    <custom-mini-item-carousel :items="categories" labelField="name" @select-item="goToCategory" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $messages = inject('messages');

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const category = ref(null);

onMounted(() => setCategory());

watch(
  () => props.categories,
  () => setCategory(),
  { once: true }
);

watch(
  () => route.params.categoryId,
  () => setCategory()
);

function setCategory() {
  category.value = props.categories.find((o) => o.categoryId === route.params.categoryId);
}

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}
</script>
