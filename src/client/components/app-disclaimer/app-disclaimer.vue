<template>
  <div class="app-disclaimer">
    <div class="app-disclaimer__content">
      <h1 class="title">{{ disclaimer.title }}</h1>
      <div class="app-disclaimer__body">
        <div class="app-disclaimer__text md-body-1" v-html="disclaimer.content" />
        <nuxt-link :to="`/${$i18n.locale}/legal`" class="app-disclaimer__link md-body-1">{{ $t('read_full_terms_and_conditions') }}</nuxt-link>
      </div>
      <footer class="app-disclaimer__footer">
        <span class="md-body-1 app-disclaimer__copyright">{{ disclaimer.footer }}</span>
        <md-button
          class="md-raised md-primary"
          @click="$emit('accepted')">
          {{ $t('ok') }}
        </md-button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disclaimer: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
}
</script>


<style>
.app-disclaimer {
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.app-disclaimer__content {
  padding: var(--spacing-default) var(--spacing-double);
  background-color: var(--text-color);
  color: var(--background-color);
  width: 100%;
}

.app-disclaimer__body {
  margin-bottom: var(--spacing-double);
}

.app-disclaimer__text {
  margin-bottom: var(--spacing-half);
}

.app-disclaimer__link {
  color: #fff !important;
}

.app-disclaimer__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-disclaimer__copyright {
  font-size: var(--font-size-extra-small);
  margin-right: var(--spacing-double);
}
</style>
