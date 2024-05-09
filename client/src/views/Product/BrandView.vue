<template>
  <div class="content-section"></div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  brands: {
    type: Array,
    default: () => []
  }
});

const brand = computed(() => props.brands.find((o) => o.brandId === route.params.brandId));

function goToBrand(item) {
  router.push({ name: 'ProductBrand', params: { brandId: item.brandId } });
}
</script>
