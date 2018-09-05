<template>
  <div class="search">
    <span v-if="value === ''" class="search__search-icon" />
    <input
      v-model="value"
      class="search__input"
      type="text"
      placeholder="Search">
    <button class="search__delete-icon" @click="onClear" />
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
      this.$emit('clearSearch')
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
  border-radius: var(--border-radius-small);
  border: 2px solid var(--text-color);
}

.search:focus-within {
  border-color: var(--action-color);
}

.search__search-icon {
  background-image: url('/images/search.svg');
  background-size: contain;
}

.search__delete-icon {
  background-color: var(--text-color);
  background-image: url('/images/delete.svg');
  background-size: 50%;
  border-radius: 50%;
}

.search__search-icon,
.search__delete-icon {
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
}

.search__input {
  width: 230px;
  height: 100%;
  border-style: none;
  padding: 0 8px;
}

.search__input:focus {
  outline: none;
}
</style>
