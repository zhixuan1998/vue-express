<template>
  <div class="custom-dropdown" ref="dropdownEl">
    <div class="dropdown-container" @click="openDropdown">
      <button class="dropdown-opener">
        <div>{{ displayValue }}</div>
        <font-awesome-icon
          v-if="!hideDropdownIcon"
          :icon="showDropdown ? faAngleUp : faAngleDown"
        />
      </button>
    </div>
    <div class="menu-container" :class="{ open: showDropdown }">
      <div class="menu-content">
        <span class="menu-item" v-if="searchable">
          <input
            :value="searchValue"
            :readonly="!searchable"
            @mouseenter="menuOnHover ? openDropdown : () => {}"
            @input="
              (e) => {
                searchValue = e.target.value;
                search(e.target.value);
              }
            "
          />
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
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  keyField: { type: String, default: 'key' },
  valueField: { type: [String, Function], default: 'value' },
  displayField: { type: [String, Function], default: 'value' },
  searchable: Boolean,
  menuOnHover: Boolean, // temporarily not working
  hideDropdownIcon: Boolean,
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
const displayValue = ref('');
const selectedItem = defineModel();
const dropdownEl = ref(null);
const filteredOptions = ref([]);

onMounted(() => {
  setRelativeElPosition();
  initSearch();
  initDisplayValue();
});

watch(
  () => props.options,
  () => {
    initSearch();
    initDisplayValue();
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
  displayValue.value =
    typeof props.displayField === 'function' ? props.displayField(item) : item[props.displayField];
  selectedItem.value = item[props.keyField];
  hideDropdown();
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

function initDisplayValue() {
  if (!selectedItem.value) return;

  const initOption = filteredOptions.value.find((o) => o[props.keyField] === selectedItem.value);
  displayValue.value = initOption
    ? typeof props.displayField === 'function'
      ? props.displayField(initOption)
      : initOption[props.displayField]
    : '';
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
  .dropdown-container,
  .dropdown-container .dropdown-opener {
    height: 100%;
  }

  .dropdown-container {
    display: flex;
    align-items: center;
    cursor: pointer;

    .dropdown-opener {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 10px;
      border: none;
      background-color: rgba(0, 0, 0, 0);

      div {
        display: flex;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .fa-angle-down,
    .fa-angle-up {
      font-size: 15px;
      margin-left: 10px;
    }
  }

  .menu-container {
    display: grid;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: v-bind(menuHeight);
    grid-template-rows: 0fr;
    border: none;
    transition: grid-template-rows 0.1s;
    z-index: 10;

    &.open {
      grid-template-rows: 1fr;
      border: 1px solid var(--theme-color-s);
    }

    .menu-content {
      --scrollbal-thumb-mouseout-color: rgba(36, 32, 104, 0);
      --scrollbal-thumb-mouseenter-color: rgba(36, 32, 104, 0.4);

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
        padding: 5px 10px;
        cursor: pointer;

        &.selected:not(:has(input)),
        &:hover:not(:has(input)) {
          background-color: rgba(228, 206, 255, 0.5);
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
          border: 1px solid rgba(36, 32, 104, 0.2);

          &:focus {
            border: 1px solid rgba(36, 32, 104, 0.6);
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
}
</style>
