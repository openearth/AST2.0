<template>
  <div class="search">
    <span v-if="value === ''" class="search__icon search__icon--magnifyglass" />
    <input
      v-model="value"
      :class="{ 'search__input--active' : value !== '' }"
      class="search__input"
      type="text"
      placeholder="Search">
    <button class="search__icon search__icon--trash" @click="value = ''" />
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
}
</script>

<style>
.search {
  position: relative;
  width: 250px;
  height: 40px;
  background-color: var(--background-color);
  border: 1px solid var(--text-light-color);
  border-radius: var(--border-radius-small);
}

.search__icon--magnifyglass {
  left: var(--spacing-half);
  background-image: url('/images/search.svg');
  background-size: contain;
}

.search__icon--trash {
  right: var(--spacing-half);
  background-color: var(--text-color);
  background-image: url('/images/delete.svg');
  background-size: 50%;
  border-radius: 50%;
}

.search__icon {
  position: absolute;
  top: calc(50% - 10px);
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
}

.search__input {
  padding: 0 var(--spacing-double);
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-style: none;
}

.search__input--active {
  padding-left: var(--spacing-half);
}
</style>
