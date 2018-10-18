<template>
  <input
    :class="{ 'search-input--visible' : show }"
    type="search"
    class="search-input"
    @change="(event) => $emit('search', event)">
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style>
.search-input {
  width: 0;
  padding: .5rem;
  border: none;
  border-radius: 50%;
  opacity: 0;
  box-shadow: var(--shadow-small-grey);
  animation: show .5s ease-in-out;
}

.search-input--visible {
  animation: show .5s ease-in-out forwards;
}

@keyframes show {
  0% {
    width: 0;
    border-radius: 50%;
    opacity: 0;
  }

  50% {
    border-radius: 5px;
    opacity: 1;
  }

  100% {
    width: 250px;
    opacity: 1;
    border-radius: 5px;
  }
}
</style>
