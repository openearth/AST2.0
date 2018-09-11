<template>
  <div class="settings">
    <header class="settings__header">
      <h2>{{ $t('settings') }}</h2>
      <nav>
        <ul>
          <li><nuxt-link :to="`/${this.$i18n.locale}/settings/project-area`">{{ $t('project_area') }}</nuxt-link></li>
          <li><nuxt-link :to="`/${this.$i18n.locale}/settings/general`">{{ $t('general') }}</nuxt-link></li>
        </ul>
      </nav>
    </header>

    <nuxt-child />
  </div>
</template>

<script>

</script>

<style>
.settings {
  width: 700px;
  display: flex;
  flex-direction: column;
}

.settings__header {
  flex-shrink: 0;
}
</style>
