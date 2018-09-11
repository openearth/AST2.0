<template>
  <div class="app-header">
    <h2>AST 2.0</h2>
    <nuxt-link :to="`/${this.$i18n.locale}/my-measures`" class="app-header__link">My measures</nuxt-link>
  </div>
</template>

<style>
.app-header {
  background-color: #2196F3;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-default);
}

.app-header__link {
  text-decoration: none;
  color: var(--background-color);
}
</style>
