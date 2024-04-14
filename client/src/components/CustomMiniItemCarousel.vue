<template>
  <swiper-container
    class="swiper-container"
    :slides-per-view="4"
    :slides-per-group="2"
    :resize-observer="true"
    :breakpoints="{
      992: {
        slidesPerView: 10
      },
      768: {
        slidesPerView: 8
      },
      400: {
        slidesPerView: 6
      }
    }"
    @swiperslidechange="onSlideChange"
  >
    <swiper-slide
      v-for="(columnItems, i) of formattedItems"
      :key="i"
      class="swiper-slide"
      :class="{
        'border-right-invisible':
          i === activeIndex + totalColumn - 1 || i === formattedItems.length - 1
      }"
    >
      <div v-for="(item, j) of columnItems" :key="j" class="w-100 item-container">
        <div @click="selectItem(item)" class="item-image">
          <img
            :src="`https://picsum.photos/id/${i * 2 + j + 100}/200/200`"
            class="rounded-circle"
            onerror="this.src='https://picsum.photos/200'"
          />
        </div>
        <p v-if="item[labelField]" class="item-label">{{ item[labelField] }}</p>
      </div>
    </swiper-slide>
  </swiper-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { register } from 'swiper/element/bundle';
import { useMediaQuery } from '@/hooks';

register();

const emits = defineEmits(['select-item']);

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  labelField: String
});

const [fourColumn, sixColumn, eightColumn] = useMediaQuery([
  { maxWidth: '400px' },
  { maxWidth: '768px' },
  { maxWidth: '992px' }
]);

const activeIndex = ref(0);

const totalColumn = computed(
  () => (fourColumn.value && 4) || (sixColumn.value && 6) || (eightColumn.value && 8) || 10
);

const formattedItems = computed(() => {
  if (!props.items?.length) return [];

  let newItems = [];

  for (let i = 0; i < props.items.length; i += 2) {
    newItems.push(props.items.slice(i, i + 2));
  }

  return newItems;
});

function onSlideChange(swiper) {
  activeIndex.value = swiper.detail[0].activeIndex;
}

function selectItem(item) {
  emits('select-item', item);
}
</script>

<style lang="scss" scoped>
.swiper-container {
  width: 100%;

  .swiper-slide {
    --border-color: rgba(228, 206, 255, 0.5);
    --item-border: 1px solid var(--border-color);

    &.border-right-invisible .item-container {
      border-right-color: rgba(0, 0, 0, 0);
    }

    &.border-right-invisible .item-container:hover {
      border-right-color: var(--border-color);
    }

    @media (width < 576px) {
      border-bottom: var(--item-border);
    }

    .item-container {
      padding: 5px;
      cursor: pointer;
      transition: background-color 0.15s;
      border-right: var(--item-border);
      background-color: #ffffff;
      transition: box-shadow 0.15s;

      &:hover {
        box-shadow: inset 0 0 3px 1.5px var(--border-color);

        img {
          scale: 0.95;
        }
      }

      &:nth-child(2n) {
        border-top: var(--item-border);
      }

      .item-image {
        display: flex;
        width: 100%;
        aspect-ratio: 1 / 1;

        img {
          border: var(--item-border);
          margin: auto;
          width: 50%;
          transition: scale 0.15s;
        }
      }

      .item-label {
        margin: 0;
        height: 40px;
        text-align: center;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
