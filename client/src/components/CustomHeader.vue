<template>
  <div class="header-container" :class="{ 'search_box-enabled': searchBox }">
    <div class="logo-container">
      <icon-logo class="logo" @click="router.push({ name: 'home' })" />
      <div v-if="slots['right-content']" class="right-content">
        <slot name="right-content"></slot>
      </div>
    </div>
    <custom-search-box v-if="searchBox" @search="search" />
    <div class="menu-container">
      <auth-menu v-if="authMenu" />
      <user-menu v-if="userMenu" />
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue';
import { useRouter } from 'vue-router';

import IconLogo from './icons/IconLogo.vue';
import AuthMenu from './Header/AuthMenu.vue';
import UserMenu from './Header/UserMenu.vue';

defineProps({
  searchBox: {
    type: Boolean,
    default: false
  },
  authMenu: {
    type: Boolean,
    default: false
  },
  userMenu: {
    type: Boolean,
    default: false
  }
});

const slots = useSlots();
const router = useRouter();

async function search(value) {
  console.log(value);
}
</script>

<style lang="scss" scoped>
@import '../assets/mixin.scss';

.header-container {
  @include base-container;

  display: grid;
  grid-auto-flow: column;
  background: var(--theme-color-s);
  grid-template: 'logo search-box menu' auto / 1fr minmax(280px, 40vw) 1fr;
  grid-gap: 10px 15px;

  &:not(.search_box-enabled) {
    grid-template: 'logo menu' auto;
  }

  & > * {
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
      color: rgba(36, 32, 104, 1);
    }
  }

  .search_box-container {
    grid-area: search-box;
  }

  @media (width < 576px) {
    grid-template:
      'logo menu' auto
      'search-box search-box' auto;
  }
}
</style>

<style lang="scss">
.header-container {
  .menu-container {
    display: flex;
    align-items: center;
    grid-area: menu;
    justify-content: flex-end;

    .item {
      user-select: none;

      &:not(:last-child) {
        border-right: 1px solid var(--theme-color-l);
      }

      a {
        padding: 0 10px;
        text-decoration: none;
        color: rgba(36, 32, 104, 0.5);
        font-weight: 600;
        cursor: pointer;

        &:hover {
          color: rgba(36, 32, 104, 1);
        }
      }
    }
  }
}
</style>
