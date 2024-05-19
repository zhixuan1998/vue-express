<template>
  <div class="radio_group-container">
    <div class="label">{{ label }}</div>
    <div class="flex radio_button-container" :class="{ 'vertical-layout': verticalLayout }">
      <div v-for="(item, i) of formattedOptions" :key="i" class="radio-container">
        <input
          :id="`${radioGroupName}-${i}`"
          type="radio"
          :name="radioGroupName"
          :value="item.key"
          @change="(e) => (modelValue = e.target.value)"
        />
        <label :for="`${radioGroupName}-${i}`">{{ item.value }}</label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: 'label'
  },
  keyField: {
    type: [String, Function],
    default: 'key'
  },
  valueField: {
    type: [String, Function],
    default: 'value'
  },
  verticalLayout: Boolean
});

const formattedOptions = ref([]);
const radioGroupName = `radio-group-${new Date().getTime()}`;

onMounted(() => {
  formatOptions();
});

function formatOptions() {
  formattedOptions.value = props.options.map((item) => {
    if (item instanceof Object) {
      return {
        key: item[
          typeof props.keyField === 'function'
            ? props.keyField(item) ?? 'key'
            : item[props.keyField]
        ],
        value:
          item[
            typeof props.valueField === 'function'
              ? props.valueField(item) ?? 'value'
              : item[props.valueField]
          ]
      };
    }

    return { key: item, value: item };
  });
}

watch(
  () => props.options,
  () => {
    formatOptions();
  }
);

const modelValue = defineModel();
</script>

<style lang="scss" scoped>
.radio_group-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 5px;

  .radio_button-container {
    display: flex;
    gap: 20px;

    &.vertical-layout {
      flex-direction: column;
    }

    .radio-container {
      --button-dimension: 20px;

      position: relative;

      input[type='radio'] {
        position: absolute;
        opacity: 0;

        &:checked + label::before {
          background-color: func.theme-color(xl);
          box-shadow: inset 0 0 0 3px #ffffff;
        }

        & + label::before {
          content: '';
          position: absolute;
          inset: 0;
          width: var(--button-dimension);
          height: 20px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1px solid #{func.theme-color(xl)};
          transition: all 0.25s;
        }
      }

      label {
        margin-left: calc(var(--button-dimension) + 5px);
      }
    }
  }
}
</style>
