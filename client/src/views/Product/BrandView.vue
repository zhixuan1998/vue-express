<template>
  <div class="content-section">
    <div class="content-label">{{ $messages.title.brands() }} - {{ brand?.name ?? '' }}</div>
    <custom-mini-item-carousel :items="brands" labelField="name" @select-item="goToBrand" />
  </div>
</template>

<script setup>
import { onMounted, ref, inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');
const $messages = inject('messages');

const brands = ref([]);

onMounted(async () => {
  const brandResults = await $repositories.brandRepository.getAll({});
  brands.value = brandResults?.data?.data?.results ?? [];
});

const brand = computed(() => brands.value.find((o) => o.brandId === route.params.brandId));

function goToBrand(item) {
  router.push({ name: 'ProductBrand', params: { brandId: item.brandId } });
}
</script>
