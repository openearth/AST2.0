<template>
  <md-drawer md-permanent="clipped" class="legal">
    <button class="md-link" @click="$router.go(-1)">&#x2190; {{ $t('back') }}</button>
    <div class="new-project__content">
      <h1 class="md-title">{{ legal.title }}</h1>
      <rich-text :text="legal.content" />
    </div>
  </md-drawer>
</template>

<script>
import { RichText } from '~/components'
import getData from '~/lib/get-data'

export default {
  layout: 'inactive-map',
  components: { RichText },
  async asyncData({ params, store }) {
    const { locale } = store.state.i18n
    const data = await getData({ locale, slug: 'legal' })
    return { legal: { ...data.legal } }
  },
}
</script>

<style>
.legal {
  width: var(--width-large);
  padding: var(--spacing-double);
}

.legal p {
  margin-bottom: var(--spacing-default);
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
