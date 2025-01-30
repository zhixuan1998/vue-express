<template>
  <div class="menu-container" :class="{ open: visible || show, animation }">
    <slot></slot>
    <div class="menu-content">
      <span class="menu-item" v-if="searchable">
        <input v-model="searchValue" />
      </span>
      <span v-if="!filteredOptions?.length" class="menu-item text-center"> No options </span>
      <span
        v-else
        v-for="(item, i) of filteredOptions"
        class="menu-item"
        :class="{ selected: selectedItem === item[keyField] }"
        :key="i"
        @mousedown="selectItem(item)"
        >{{
          typeof valueField === 'function' ? valueField(item) ?? item[valueField] : item[valueField]
        }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { makeCustomMenuProps } from './PropsDefinition';

const show = defineModel('show');
const selectedItem = defineModel('item');

const props = defineProps(makeCustomMenuProps());

const searchValue = ref('');

const filteredOptions = computed(() =>
  props.options.filter((o) => {
    const escapedSearchValue = searchValue.value?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') ?? '';
    const regex = new RegExp(`.*${escapedSearchValue}.*`, 'i');
    const value =
      typeof props.valueField === 'function' ? props.valueField(o) : o[props.valueField];
    return regex.test(value);
  })
);

watch(show, (newShow) => {
  if (newShow === true) {
    setTimeout(resetSearchValue, 150);
  }
});

function resetSearchValue() {
  searchValue.value = '';
}

async function selectItem(item) {
  selectedItem.value = await item[props.keyField];
  show.value = false;
  item.fn?.();
}
</script>

<style lang="scss" scoped>
.menu-container {
  display: grid;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: v-bind(menuHeight);
  grid-template-rows: 0fr;
  border: none;
  z-index: 10;

  &.animation {
    transition: grid-template-rows 0.1s;
  }

  &.open {
    grid-template-rows: 1fr;
    border: 1px solid #{func.theme-color(l, 0.6)};
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    background-color: #ffffff;

    @supports selector(::-webkit-scrollbar) {
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        height: 15px;
        border-radius: 50px;
        background-color: #fff;
      }

      &:hover::-webkit-scrollbar-thumb {
        background-color: func.theme-color(l);
      }
    }

    @supports (not selector(::-webkit-scrollbar)) and (scrollbar-color: auto) {
      scrollbar-color: #fff;
      scrollbar-width: thin;

      &:hover {
        scrollbar-color: func.theme-color(l);
      }
    }

    .menu-item {
      color: func.theme-color(xl);
      width: 100%;
      padding: 5px 10px;
      cursor: pointer;

      &.selected:not(:has(input)),
      &:hover:not(:has(input)) {
        background-color: func.theme-color(xs);
      }

      &:has(input) {
        background-color: #ffffff;
        position: sticky;
        top: 0;
        left: 0;
      }

      input {
        padding: 1px 5px;
        width: 100%;
        border: 1px solid #{func.theme-color(l, 0.3)};

        &:focus {
          border: 1px solid #{func.theme-color(l, 0.6)};
        }

        &:not(:read-only):focus::placeholder,
        &:not(:read-only):focus::-webkit-input-placeholder {
          color: transparent;
        }

        &::placeholder,
        &::-webkit-input-placeholder {
          color: inherit;
        }
      }
    }
  }
}
</style>
