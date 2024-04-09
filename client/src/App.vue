<template>
  <div style="width: 100vw; height: 100vh">
    <router-view></router-view>
    <div v-show="showModalOverlay" class="modal-overlay">
      <Transition name="bounce" @after-leave="hideModalOverlay">
        <div v-show="showModalContainer" class="modal-container">
          <div class="title">{{ modal.title }}</div>
          <div class="body">{{ modal.message }}</div>
          <div class="button">
            <custom-button @click="hideModalContainer">{{ modal.buttonText }}</custom-button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, provide, inject } from 'vue';

const $messages = inject('messages');

const showModalOverlay = ref(false);
const showModalContainer = ref(false);

const modal = reactive({
  title: '',
  message: '',
  buttonText: ''
});

const hideModalOverlay = () => {
  showModalOverlay.value = false;
  resetModal();
};

const hideModalContainer = () => {
  showModalContainer.value = false;
};

const openModal = (obj) => {
  const {
    title = $messages.error.title.oops(),
    message = $messages.error.message.general(),
    buttonText = $messages.button.ok()
  } = obj ?? {};

  modal.title = title;
  modal.message = message;
  modal.buttonText = buttonText;

  showModalOverlay.value = true;
  showModalContainer.value = true;
};

const resetModal = () => {
  modal.title = modal.message = modal.buttonText = '';
};

provide('modal', { hide: hideModalContainer, open: openModal });
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: absolute;
  display: flex;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 20;

  .modal-container {
    display: flex;
    margin: auto;
    flex-direction: column;
    width: min(100%, 500px);
    background-color: #ffffff;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.14);
    padding: 30px;
    row-gap: 20px;

    & > * {
      width: 100%;
    }

    .title,
    .body,
    .button {
      text-align: center;
    }

    .title {
      font-size: 20px;
      font-weight: 550;
    }

    .body {
      font-size: 15px;
    }
  }
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    scale: 0;
  }
  50% {
    scale: 1.25;
  }
  100% {
    scale: 1;
  }
}
</style>
