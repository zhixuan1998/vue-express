<template>
  <div class="search_box-container">
    <input
      class="input"
      v-model="inputValue"
      :readonly="readonly"
      :placeholder="placeholder"
      @keyup="
        {
          if ($event.keyCode === 13) search();
        }
      "
    />
    <custom-dropdown
      v-if="searchOptions.length"
      v-model="dropdownValue"
      :options="searchOptions"
    ></custom-dropdown>
    <div class="icon-wrapper" @click="search">
      <font-awesome-icon :icon="faSearch" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const emits = defineEmits(['search']);

const route = useRoute();

const inputValue = ref('');
const dropdownValue = ref('');
let previousInputValue = '';
let previousDropdownValue = '';

const props = defineProps({
  searchOptions: Array,
  searchDropdown: Object,
  placeholder: {
    type: String,
    default: 'Search'
  },
  readonly: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '100%'
  }
});

onMounted(() => {
  initDropdownValue();
  initInputValue();
});

function search() {
  if (
    !inputValue.value ||
    (inputValue.value === previousInputValue && dropdownValue.value === previousDropdownValue)
  )
    return;

  emits('search', inputValue.value, dropdownValue.value);
  previousInputValue = inputValue.value;
  previousDropdownValue = dropdownValue.value;
}

function initInputValue() {
  inputValue.value = route.query.search ? decodeURI(route.query.search) : '';
}

function initDropdownValue() {
  if (!props.searchOptions?.length) return (dropdownValue.value = '');

  dropdownValue.value = props.searchDropdown?.keyField
    ? props.searchOptions[0][props.searchDropdown.keyField]
    : props.searchOptions[0].key;
}

watch(
  () => props.searchOptions,
  () => initDropdownValue()
);
</script>

<style lang="scss">
.search_box-container {
  --cont-height: 45px;
  --padding: 5px;

  display: grid;
  align-items: center;
  grid-template: 'input icon' 1fr / auto calc(var(--cont-height) * 1.2);
  position: relative;
  padding: var(--padding);
  width: v-bind(width);
  height: auto;
  background-color: #ffffff;

  & > * {
    height: calc(var(--cont-height) - (var(--padding) * 2));
  }

  @media (width < 400px) {
    grid-row-gap: 5px;
  }

  &:has(.custom-dropdown) {
    grid-template: 'input dropdown icon' 1fr / auto max-content calc(var(--cont-height) * 1.2);

    @media (width < 400px) {
      grid-template:
        'input icon' 1fr
        'dropdown dropdown' minmax(0, 1fr) / 1fr calc(var(--cont-height) * 1.2);
    }
  }

  .input {
    grid-area: input;
    flex-grow: 1;
    padding: 0 0 0 10px;
    font-size: inherit;
  }

  .custom-dropdown {
    grid-area: dropdown;

    @media (width < 400px) {
      padding-top: 5px;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
    }

    .dropdown-container .dropdown-opener {
      width: max-content;
      color: rgba(0, 0, 0, 0.6);
      height: 65%;
      border-left: 1px solid rgba(0, 0, 0, 0.3);

      @media (width < 400px) {
        width: 100%;
        border-left-width: 0;
      }
    }
  }

  .icon-wrapper {
    grid-area: icon;
    width: calc(var(--cont-height) * 1.2);
    height: 100%;
    display: flex;
    background-color: func.theme-color(s);
    cursor: pointer;
    transition-duration: 0.15s;

    svg {
      margin: auto;
      color: func.theme-color(l);
      transition-duration: inherit;
    }

    &:active svg {
      scale: 0.85;
    }
  }
}
</style>
