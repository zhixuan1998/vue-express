<template>
  <div
    v-show="open"
    class="popover-container"
    :class="[`popover-${direction}`]"
    :popover-id="popoverId"
  >
    <custom-menu v-bind="menuProps" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { filterProps } from './utils/props';
import { makeCustomMenuProps } from './PropsDefinition';

const props = defineProps({
  displayField: { type: [String, Function], default: 'value' },
  open: Boolean,
  relativeParentClass: String,
  direction: {
    type: String,
    default: 'bottom'
  },
  ...makeCustomMenuProps()
});

const popoverId = `popover-${new Date().getTime()}`;

const menuProps = filterProps({ ...props, visible: true }, makeCustomMenuProps());

onMounted(() => {
  setRelativeElPosition();
});

function setRelativeElPosition() {
  const el = props.relativeParentClass
    ? document.querySelector(
        `.${props.relativeParentClass}:has( .popover-container[popover-id="${popoverId}"])`
      )
    : document.querySelector(`*:has(> .popover-container[popover-id="${popoverId}"])`);

  if (el) {
    el.style.position = 'relative';
  }
}
</script>

<style lang="scss">
.popover-container {
  --arrow-side-gap: 100%;
  --arrow-height: 10px;
  --padding: calc(var(--arrow-height) / 2);

  position: absolute;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10;

  .menu-container {
    width: max-content;
    border: 1px solid #{func.theme-color(l, 0.6)};
    position: static;
  }

  &::after {
    content: '';
    position: absolute;
    width: var(--arrow-height);
    height: var(--arrow-height);
    border: 1px solid #{func.theme-color(l, 0.6)};
    border-right-width: 0;
    border-bottom-width: 0;
    background-image: linear-gradient(135deg, #fff 0%, #fff 52%, transparent 52%, transparent 100%);
  }

  &.popover-top {
    bottom: 100%;
    padding-bottom: var(--padding);

    &::after {
      left: 0;
      bottom: 0;
      transform: translateX(var(--arrow-side-gap)) rotate(225deg);
    }
  }

  &.popover-bottom {
    top: 100%;
    padding-top: var(--padding);

    &::after {
      top: 0;
      left: 0;
      transform: translateX(var(--arrow-side-gap)) rotate(45deg);
    }
  }

  &.popover-left {
    top: 0;
    right: 100%;
    padding-right: var(--padding);

    &::after {
      top: 0;
      right: 0;
      transform: translateY(var(--arrow-side-gap)) rotate(135deg);
    }
  }

  &.popover-right {
    top: 0;
    left: 100%;
    padding-left: var(--padding);

    &::after {
      top: 0;
      left: 0;
      transform: translateY(var(--arrow-side-gap)) rotate(-45deg);
    }
  }
}
</style>
