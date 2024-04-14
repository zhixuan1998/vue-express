<template>
  <div class="content-section">
    <div class="content-label">{{ $messages.title.categories() }} - {{ category?.name || '' }}</div>
    <custom-mini-item-carousel :items="categories" labelField="name" @select-item="setCategory" />
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
const router = useRouter();
const $repositories = inject('repositories');
const $messages = inject('messages');

const categoryId = defineModel('categoryId');
const categories = ref([]);
const category = ref('');

onBeforeRouteUpdate((to) => setCategory(to.params));

onMounted(async () => {
  const categoryResults = await $repositories.categoryRepository.getAll({});
  categories.value = categoryResults?.data?.data?.results ?? [];

  setCategory(route.params, true);
});

function setCategory(params, replaceRoute = false) {
  const [paramName, index] = params.categoryId.split('.');

  if (paramName && !isNaN(index)) {
    setCategoryWithIndex({ paramName, index });
  } else {
    setCategoryWithCategoryId(params.categoryId, replaceRoute);
  }

  if (category.value) {
    categoryId.value = category.value.categoryId; 
  }
}

function setCategoryWithCategoryId(categoryId, replaceRoute) {
  if (!categories.value.length || !categoryId) return;

  let index = 0;

  for (let i = 0; i < categories.value.length; i++) {
    const found = categories.value[i].categoryId === categoryId;

    if (found) {
      index = i;
      category.value = categories.value[i];
      break;
    }
  }

  if (!category.value) {
    return router.push({ name: 'Product' });
  }

  const formattedName = category.value.name.replaceAll(' ', '-');

  const config = {
    name: 'ProductCategory',
    params: { categoryId: `${formattedName}.${index}` }
  };

  replaceRoute ? router.replace(config) : router.push(config);
}

function setCategoryWithIndex({ paramName, index }) {
  if (!categories.value.length || (!paramName && isNaN(index))) return;

  paramName = paramName.replaceAll('-', ' ');

  category.value = categories.value[index];

  if (paramName !== category.value?.name) {
    return router.push({ name: 'Product' });
  }
}
</script>
