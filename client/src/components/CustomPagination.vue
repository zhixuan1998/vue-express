<template>
  <div class="pagination-indicator-container" :class="{ disabled: props.disabled }">
    <span
      class="indicator-button"
      :class="{ disabled: isFirstThree || noRest }"
      @click="beforeMove(PAGE_MOVEMENT.START)"
    >
      <font-awesome-icon :icon="faAnglesLeft" />
    </span>
    <span
      class="indicator-button"
      :class="{ disabled: currentPage === 1 }"
      @click="beforeMove(PAGE_MOVEMENT.BACKWARD)"
    >
      <font-awesome-icon :icon="faAngleLeft" />
    </span>

    <span
      class="indicator-button"
      :class="{ active: item === currentPage, rest: item === rest }"
      v-for="(item, i) of dynamicButtons"
      :key="i"
      @click="beforeMove(item)"
      >{{ item }}</span
    >

    <span
      class="indicator-button"
      :class="{ disabled: currentPage === props.totalPages }"
      @click="beforeMove(PAGE_MOVEMENT.FORWARD)"
    >
      <font-awesome-icon :icon="faAngleRight" />
    </span>
    <span
      class="indicator-button"
      :class="{ disabled: isLastThree || noRest }"
      @click="beforeMove(PAGE_MOVEMENT.END)"
    >
      <font-awesome-icon :icon="faAnglesRight" />
    </span>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight
} from '@fortawesome/free-solid-svg-icons';

const PAGE_MOVEMENT = {
  FORWARD: 'forward',
  BACKWARD: 'backward',
  START: 'start',
  END: 'end'
};

const currentPage = defineModel();

const props = defineProps({
  totalPages: {
    type: Number,
    default: 1
  },
  beforeUpdate: {
    type: Function,
    default: () => {}
  },
  disabled: Boolean
});

const rest = '...';

onBeforeMount(() => {
  currentPage.value =
    currentPage.value <= props.totalPages && currentPage.value > 0 ? currentPage.value : 1;
});

const isFirstThree = computed(() => currentPage.value <= 3);
const isLastThree = computed(() => props.totalPages - currentPage.value < 3);
const noRest = computed(() => props.totalPages <= 5);

const dynamicButtons = computed(() => {
  const total = props.totalPages;

  if (noRest.value) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (isFirstThree.value && !isLastThree.value) {
    return [1, 2, 3, 4, rest];
  }

  if (!isFirstThree.value && isLastThree.value) {
    return [rest, total - 3, total - 2, total - 1, total];
  }

  return [rest, currentPage.value - 1, currentPage.value, currentPage.value + 1, rest];
});

function getNewPage(action) {
  switch (action) {
    case PAGE_MOVEMENT.FORWARD:
      return currentPage.value + 1;
    case PAGE_MOVEMENT.BACKWARD:
      return currentPage.value - 1;
    case PAGE_MOVEMENT.START:
      return 1;
    case PAGE_MOVEMENT.END:
      return props.totalPages;
    default:
      return currentPage.value;
  }
}

async function beforeMove(arg) {
  const page = typeof arg === 'number' ? arg : getNewPage(arg);

  if (page === currentPage.value) {
    return;
  }

  if (typeof props.beforeUpdate === 'function') {
    await props.beforeUpdate(page);
  }

  currentPage.value = page;
}
</script>

<style lang="scss">
.pagination-indicator-container {
  display: flex;

  &.disabled,
  .disabled,
  .rest {
    cursor: default;
    pointer-events: none;
  }

  .indicator-button {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-left: -1px;
    width: 40px;
    height: 40px;
    border: 1px solid func.theme-color(s);

    color: func.theme-color(l);
    cursor: pointer;
    user-select: none;

    &.active {
      background-color: func.theme-color(l);
      border-color: func.theme-color(l);
      color: func.theme-color(xs);
      z-index: 1;
    }

    &:not(.active):not(.disabled):not(.rest):hover {
      background-color: func.theme-color(s);
    }

    &.disabled {
      color: func.theme-color(l, 0.5);
    }
  }
}
</style>
