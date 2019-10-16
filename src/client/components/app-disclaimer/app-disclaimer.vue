<template>
  <article
    class="app-disclaimer"
    role="dialog"
    aria-labelledby="disclaimer-title"
    aria-describedby="disclaimer-content"
  >
    <div class="app-disclaimer__content">

      <header>
        <h3 id="disclaimer-title" class="title">
          {{ disclaimer.title }}
        </h3>
      </header>

      <section id="disclaimer-content" class="app-disclaimer__body">
        <div class="app-disclaimer__text md-body-1" v-html="disclaimer.content" />
        <nuxt-link :to="`/${$i18n.locale}/legal`" class="app-disclaimer__link md-body-1">
          {{ $t('read_full_terms_and_conditions') }}
        </nuxt-link>
      </section>

      <footer class="app-disclaimer__footer">
        <span class="md-body-1 app-disclaimer__copyright">
          {{ disclaimer.footer }}
        </span>
        <md-button class="md-raised md-primary" @click="$emit('accepted')">
          {{ $t('agree') }}
        </md-button>
      </footer>

    </div>
  </article>
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
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-color: rgba(0, 0, 0, 0.25);
}

.app-disclaimer__content {
  width: 100%;
  padding: var(--spacing-default) var(--spacing-double);

  color: var(--background-color);
  background-color: var(--text-color);
}

.device-iOS.device-Safari .app-disclaimer__content {
  padding-bottom: calc(var(--spacing-double) * 1.5);
}

.app-disclaimer__body {
  max-height: 19vh;
  margin-bottom: var(--spacing-double);
  overflow-y: auto;
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
  margin-right: var(--spacing-double);
  font-size: var(--font-size-extra-small);
}
</style>
