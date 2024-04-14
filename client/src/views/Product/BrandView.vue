<template>
  <div class="content-section">
    <div class="content-label">{{ $messages.title.brands() }} - {{ brand?.name ?? '' }}</div>
    <custom-mini-item-carousel :items="brands" labelField="name" @select-item="setBrand" />
  </div>
</template>

<script setup>
import { onMounted, ref, inject, watch } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');
const $messages = inject('messages');

const brandId = defineModel('brandId');
const brands = ref([]);
const brand = ref('');

onBeforeRouteUpdate((to) => setBrand(to.params));

onMounted(async () => {
  const brandResults = await $repositories.brandRepository.getAll({});
  brands.value = brandResults?.data?.data?.results ?? [];

  setBrand();
});

function setBrand(params = route.params) {
  const [paramName, index] = params.brandId.split('.');

  if (paramName && !isNaN(index)) {
    setBrandWithIndex({ paramName, index });
  } else {
    setBrandWithBrandId(params.brandId);
  }

  if (brand.value) {
    brandId.value = brand.value.brandId;
  }
}

function setBrandWithBrandId(brandId) {
  if (!brands.value.length || !brandId) return;

  let index = 0;

  for (let i = 0; i < brands.value.length; i++) {
    const found = brands.value[i].brandId === brandId;

    if (found) {
      index = i;
      brand.value = brands.value[i];
      break;
    }
  }

  if (!brand.value) {
    return router.push({ name: 'Product' });
  }

  const formattedName = brand.value.name.replaceAll(' ', '-');

  router.push({
    name: 'ProductBrand',
    params: { brandId: `${formattedName}.${index}` }
  });
}

function setBrandWithIndex({ paramName, index }) {
  if (!brands.value.length || (!paramName && isNaN(index))) return;

  paramName = paramName.replaceAll('-', ' ');

  brand.value = brands.value[index];

  if (paramName !== brand.value?.name) {
    return router.push({ name: 'Product' });
  }
}
</script>
