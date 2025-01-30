<template>
  <div class="custom-dropdown" ref="dropdownEl">
    <div
      class="dropdown-container"
      @click="searchable ? openDropdown() : toggleDropdown()"
      @mouseenter="menuOnHover ? openDropdown() : () => {}"
    >
      <button class="dropdown-opener">
        <div>{{ displayValue }}</div>
        <font-awesome-icon
          v-if="!hideDropdownIcon"
          :icon="showDropdown ? faAngleUp : faAngleDown"
        />
      </button>
    </div>

    <custom-menu
      v-model:item="selectedItem"
      v-model:show="showDropdown"
      v-bind="menuProps"
    ></custom-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { filterProps } from './utils/props';
import { makeCustomMenuProps } from './PropsDefinition';

const props = defineProps({
  displayField: { type: [String, Function], default: 'value' },
  menuOnHover: Boolean,
  hideDropdownIcon: Boolean,
  relativeParentClass: {
    type: String,
    default: 'custom-dropdown'
  },
  ...makeCustomMenuProps()
});

const showDropdown = ref(false);
const selectedItem = defineModel();
const dropdownEl = ref(null);

const menuProps = computed(() => filterProps({ ...props, animation: true }, makeCustomMenuProps()));


onMounted(() => {
  setRelativeElPosition();
});

onClickOutside(dropdownEl, () => {
  hideDropdown();
});

function openDropdown() {
  showDropdown.value = true;
}

function hideDropdown() {
  showDropdown.value = false;
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

const displayValue = computed(() => {
  const initOption = props.options.find((o) => o[props.keyField] == selectedItem.value);

  if (!initOption) return;

  return typeof props.displayField === 'function'
    ? props.displayField(initOption)
    : initOption[props.displayField];
});

function setRelativeElPosition() {
  const el =
    document.querySelector(`.${props.relativeParentClass}:has( .custom-dropdown)`) ??
    dropdownEl.value;
  el.style.position = 'relative';
}
</script>

<style lang="scss" scoped>
.custom-dropdown {
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
      background-color: inherit;

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
}
</style>
