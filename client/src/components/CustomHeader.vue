<template>
  <header class="header-container" :class="{ 'search_box-enabled': searchBox }">
    <div class="logo-container">
      <icon-logo class="logo" @click="router.push({ name: 'Home' })" />
      <div v-if="slots['right-content']" class="right-content">
        <slot name="right-content"></slot>
      </div>
    </div>
    <custom-search-box
      v-if="searchBox"
      :searchOptions="searchOptions"
      @search="search"
      ref="searchBoxRef"
    />
    <div v-if="hasMenu" class="menu-container me-2" >
      <div class="item" v-if="!userStore.user">
        <router-link :to="`/login?redirect=${route.fullPath}`">LOGIN</router-link>
      </div>
      <div class="item" v-if="!userStore.user">
        <router-link :to="`/signup?redirect=${route.fullPath}`">SIGNUP</router-link>
      </div>
      <div class="item" v-if="userStore.user">
        <router-link to="/user/purchase"
          >{{ userStore.user.lastName }} {{ userStore.user.firstName }}
        </router-link>
      </div>
      <div class="item item-cart">
        <router-link to="/cart">
          <font-awesome-icon :icon="faCartShopping" />
        </router-link>
        <span class="item-cart-count" v-if="true">100</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, useSlots } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

import IconLogo from './icons/IconLogo.vue';

const emits = defineEmits(['search']);

defineProps({
  searchBox: Boolean,
  hasMenu: {
    type: Boolean,
    default: true
  },
  searchOptions: {
    type: Array,
    default: () => []
  }
});

const slots = useSlots();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const searchBoxRef = ref(null);

async function search(value, searchArea) {
  emits('search', value, searchArea);
}

defineExpose({ searchBoxRef });
</script>

<style lang="scss" scoped>
.header-container {
  @include mix.base-wrapper;

  display: grid;
  grid-auto-flow: column;
  background-color: func.theme-color(s);
  grid-template: 'logo search-box menu' auto / 1fr minmax(280px, 40vw) 1fr;
  grid-gap: 10px 15px;
  position: sticky;
  top: 0;
  z-index: 10;

  &:not(.search_box-enabled) {
    grid-template: 'logo menu' auto;
  }

  & > *:not(.search_box-container) {
    height: 100%;
  }

  .logo-container {
    display: flex;
    column-gap: 20px;
    grid-area: logo;
    align-items: center;
    height: 45px;

    .logo {
      width: 45px;
      height: 45px;
      cursor: pointer;
    }

    .right-content {
      font-size: 24px;
      color: func.theme-color(l);
    }
  }

  .search_box-container {
    grid-area: search-box;
  }

  @media (width < 992px) {
    grid-template:
      'logo menu' auto
      'search-box search-box' auto;
  }
}
</style>

<style lang="scss">
.header-container {
  & > .menu-container {
    display: flex;
    align-items: center;
    grid-area: menu;
    justify-content: flex-end;

    .item {
      --padding: 10px;

      user-select: none;
      text-align: center;

      padding-right: var(--padding);

      > * {
        transition: 0.15s;
      }

      &.item-cart {
        position: relative;
        padding-left: var(--padding);

        &:hover .item-cart-count {
          background-color: rgba(36, 32, 104, 1);
        }

        .item-cart-count {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          top: -12.5px;
          left: 50%;

          padding-left: calc(var(--padding) * 0.5);
          padding-right: calc(var(--padding) * 0.5);
          height: 22px;

          border-radius: 50px;
          background-color: func.theme-color(l);
          border: 1px solid #{func.theme-color(s)};

          color: func.theme-color(s);
        }
      }

      &:has(+ .item-cart) {
        border-right: 1px solid #{func.theme-color(l, 0.7)};
      }

      a {
        text-decoration: none;
        color: func.theme-color(l);
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
      }

      &:hover a {
        color: func.theme-color(xl);
      }
    }
  }
}
</style>
