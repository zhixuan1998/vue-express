<template>
  <div class="content-section">
    <div class="content-label">{{ $messages.title.categories() }} - {{ category?.name || '' }}</div>
    <custom-mini-item-carousel :items="categories" labelField="name" @select-item="goToCategory" />
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const emits = defineEmits(['update'])

const route = useRoute();
const router = useRouter();
const $messages = inject('messages');

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
})

const category = ref(null);

watch(() => route.params.categoryId, categoryId => {
  category.value = props.categories.find((o) => o.categoryId === categoryId)
  emits('update');
})

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
}
</script>
