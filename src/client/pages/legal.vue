<template>
  <md-drawer md-permanent="clipped" class="legal">
    <back-button />
    <div class="new-project__content">
      <h1 class="md-title">
        {{ legal.title }}
      </h1>
      <rich-text :text="legal.content" />
    </div>
  </md-drawer>
</template>

<script>
import { RichText, BackButton } from '~/components'
import getData from '~/lib/get-data'

export default {
  middleware: ['state-is-inactive'],
  components: { RichText, BackButton },
  async asyncData({ store }) {
    const { locale } = store.state.i18n
    const { legal } = await getData({ locale, slug: 'legal' })
    return { legal }
  },
}
</script>

<style>
.legal {
  width: var(--width-large);
  padding: var(--spacing-double);
}

.legal .md-link {
  margin: 0;
  padding: 0;
  color: var(--action-color);
  display: block;
  margin-left: auto;
  margin-bottom: var(--spacing-double);
}
</style>
