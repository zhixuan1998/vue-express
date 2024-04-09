<template>
  <div class="custom-dropdown" ref="dropdownEl">
    <div class="input-container">
      <input
        :value="searchValue"
        :placeholder="placeholderValue"
        :readonly="!searchable"
        @click="openDropdown"
        @mouseenter="menuOnHover ? openDropdown : () => { }"
        @input="
          (e) => {
            searchValue = e.target.value;
            search(e.target.value);
          }
        "
      />
    </div>
    <div class="menu-container" :class="{ open: showDropdown }">
      <div class="menu-content">
        <span v-if="!filteredOptions?.length" class="menu-item text-center"> No options </span>
        <span
          v-else
          v-for="(item, i) of filteredOptions"
          class="menu-item"
          :class="{ selected: selectedItem === item[keyField] }"
          :key="i"
          @mousedown="selectItem(item)"
          >{{
            typeof valueField === 'function'
              ? valueField(item) ?? item[valueField]
              : item[valueField]
          }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  keyField: { type: String, default: 'value' },
  valueField: { type: [String, Function], default: 'value' },
  searchable: Boolean,
  menuOnHover: Boolean,
  relativeParentClass: {
    type: String,
    default: 'custom-dropdown'
  },
  menuHeight: {
    type: String,
    default: '250px'
  }
});

const showDropdown = ref(false);
const searchValue = ref('');
const placeholderValue = ref('');
const selectedItem = defineModel();
const dropdownEl = ref(null);
const filteredOptions = ref([]);

onMounted(() => {
  setRelativeElPosition();
  initSearch();
  placeholderValue.value = selectedItem.value;
});

watch(
  () => props.options,
  () => {
    initSearch();
  }
);

onClickOutside(dropdownEl, () => {
  hideDropdown();
  setTimeout(initSearch, 150);
});

function openDropdown() {
  showDropdown.value = true;
}

function hideDropdown() {
  showDropdown.value = false;
}

function selectItem(item) {
  placeholderValue.value = item[props.keyField];
  selectedItem.value = item[props.keyField];
  searchValue.value = '';
}

function search(inputValue) {
  filteredOptions.value = props.options.filter((o) => {
    const escapedInputValue = inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`.*${escapedInputValue}.*`, 'i');
    const value =
      typeof props.valueField === 'function' ? props.valueField(o) : o[props.valueField];
    return regex.test(value);
  });
}

function initSearch() {
  searchValue.value = '';
  filteredOptions.value = props.options;
}

function setRelativeElPosition() {
  const el =
    document.querySelector(`.${props.relativeParentClass}:has(.custom-dropdown)`) ??
    document.querySelector('.custom-dropdown');
  el.style.position = 'relative';
}
</script>

<style lang="scss" scoped>
.custom-dropdown {
  --background-color: rgba(228, 206, 255, 0.5);

  & > * {
    width: 100%;
  }

  &,
  .input-container,
  .input-container input {
    height: 100%;
  }

  .input-container {
    input {
      border: none;
      text-align: center;
      text-overflow: ellipsis;
      padding: 0 5px;
      width: 100%;
      background-color: rgba(228, 206, 255, 0.6);
      border: 1px solid rgba(36, 32, 104, 0.2);

      &:not(:read-only):focus::placeholder,
      &:not(:read-only):focus::-webkit-input-placeholder {
        color: transparent;
      }

      &:focus {
        outline: none;
        border-color: rgba(36, 32, 104, 0.6);
      }

      &::placeholder,
      &::-webkit-input-placeholder {
        color: inherit;
      }
    }
  }

  .menu-container {
    display: grid;
    position: absolute;
    top: 100%;
    left: 0;
    max-height: v-bind(menuHeight);
    grid-template-rows: 0fr;
    border: none;
    transition: grid-template-rows 0.1s;
    z-index: 10;

    &.open {
      grid-template-rows: 1fr;
      border: 1px solid var(--theme-color-s);
      border-top: none;
    }

    .menu-content {
      --scrollbal-thumb-mouseout-color: rgba(36, 32, 104, 0);
      --scrollbal-thumb-mouseenter-color: rgba(36, 32, 104, 0.4);

      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      background-color: #ffffff;

      @supports selector(::-webkit-scrollbar) {
        &::-webkit-scrollbar {
          width: 4px;
        }

        &::-webkit-scrollbar-thumb {
          height: 15px;
          border-radius: 50px;
          background-color: var(--scrollbal-thumb-mouseout-color);
        }

        &:hover::-webkit-scrollbar-thumb {
          background-color: var(--scrollbal-thumb-mouseenter-color);
        }
      }

      @supports (not selector(::-webkit-scrollbar)) and (scrollbar-color: auto) {
        scrollbar-color: var(--scrollbal-thumb-mouseout-color) #ffffff;
        scrollbar-width: thin;

        &:hover {
          scrollbar-color: var(--scrollbal-thumb-mouseenter-color) #ffffff;
        }
      }

      .menu-item {
        color: var(--theme-color-xl);
        width: 100%;
        padding: 15px;

        &.selected,
        &:not(.selected):hover {
          background-color: rgba(228, 206, 255, 0.5);
        }
      }
    }
  }
}
</style>
