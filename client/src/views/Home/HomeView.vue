<template>
    <div v-show="categories.length" class="carousel-section">
      <div class="section-title">{{ $messages.title.categories() }}</div>
      <custom-mini-item-carousel
        :items="categories"
        labelField="name"
        @select-item="goToCategory"
      />
    </div>
    <div v-show="brands.length" class="carousel-section">
      <div class="section-title">{{ $messages.title.brands() }}</div>
      <custom-mini-item-carousel :items="brands" labelField="name" @select-item="goToBrand" />
    </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const emits = defineEmits(['update']);

const router = useRouter();
const $messages = inject('messages');

defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  brands: {
    type: Array,
    default: () => []
  }
})

function goToCategory(item) {
  router.push({ name: 'ProductCategory', params: { categoryId: item.categoryId } });
  emits('update');
}

function goToBrand(item) {
  router.push({ name: 'ProductBrand', params: { brandId: item.brandId } });
  emits('update');
}
</script>

<style lang="scss"></style>
