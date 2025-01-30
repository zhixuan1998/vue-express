<template>
  <swiper-container
    class="swiper-container"
    :slides-per-view="4"
    :slides-per-group="2"
    breakpoints-base="container"
    :breakpoints="{
      768: {
        slidesPerView: 10
      },
      576: {
        slidesPerView: 8
      },
      400: {
        slidesPerView: 6
      }
    }"
  >
    <swiper-slide v-for="(columnItems, i) of formattedItems" :key="i" class="swiper-slide">
      <div
        v-for="(item, j) of columnItems"
        :key="j"
        class="w-100 item-container"
        @click="selectItem(item)"
      >
        <div class="item-image">
          <img
            :src="item.logoUrl"
            class="rounded-circle"
            onerror="this.src=FALLBACK_IMAGE_URL"
          />
        </div>
        <p v-if="item[labelField]" class="item-label">{{ item[labelField] }}</p>
      </div>
    </swiper-slide>
  </swiper-container>
</template>

<script setup>
import { computed } from 'vue';
import { register } from 'swiper/element/bundle';

const FALLBACK_IMAGE_URL = 'https://picsum.photos/200';

register();

const emits = defineEmits(['select-item']);

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  labelField: String
});

const formattedItems = computed(() => {
  if (!props.items?.length) return [];

  let newItems = [];

  for (let i = 0; i < props.items.length; i += 2) {
    newItems.push(props.items.slice(i, i + 2));
  }

  return newItems;
});

function selectItem(item) {
  emits('select-item', item);
}
</script>

<style lang="scss">
.swiper-container {
  container-type: inline-size;
  width: 100%;

  $container-breakpoints-columns:
    'width > 768px' 10,
    '576px <= width < 768px' 8,
    '400px <= width < 576px' 6,
    'width < 400px' 4;

  @mixin rightmost-border-right-transparent($container-breakpoint, $nth) {
    @container (#{$container-breakpoint}) {
      .swiper-slide-active ~ .swiper-slide:nth-of-type(#{$nth}) .item-container {
        border-right-color: rgba(0, 0, 0, 0);

        &:hover {
          border-right-color: var(--border-color);
        }
      }
    }
  }

  @each $breakpoint, $column in $container-breakpoints-columns {
    @include rightmost-border-right-transparent($breakpoint, $column);
  }

  .swiper-slide {
    --border-color: rgba(228, 206, 255, 0.5);
    --item-border: 1px solid var(--border-color);

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
        @include mix.multiline-ellipsis(2);
        margin: 0;
        height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
