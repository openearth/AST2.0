<template>
  <div class="search">
    <span v-if="value === ''" class="search__icon search__icon--magnifyglass" />
    <input
      v-model="value"
      class="search__input"
      type="text"
      placeholder="Search">
    <button class="search__icon search__icon--trash" @click="onClear" />
  </div>
</template>

<script>
export default {
  props: {
    searchValue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      value: this.searchValue,
    }
  },
  watch: {
    value(val) {
      this.$emit('onSearch', val)
    },
  },
  methods: {
    onClear() {
      this.value = ''
    },
  },
}
</script>

<style>
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-half);
  height: 40px;
  background-color: var(--background-color);
  border: 2px solid var(--text-color);
  border-radius: var(--border-radius-small);
}

.search:focus-within {
  border-color: var(--action-color);
}

.search__icon--magnifyglass {
  background-image: url('/images/search.svg');
  background-size: contain;
}

.search__icon--trash {
  background-color: var(--text-color);
  background-image: url('/images/delete.svg');
  background-size: 50%;
  border-radius: 50%;
}

.search__icon {
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
}

.search__input {
  padding: 0 var(--spacing-half);
  width: 230px;
  height: 100%;
  background-color: transparent;
  border-style: none;
}

.search__input:focus {
  outline: none;
}
</style>
