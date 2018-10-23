<template>
  <md-drawer md-permanent="clipped" class="documentation">
    <button class="md-link" @click="$router.go(-1)">&#x2190; {{ $t('back') }}</button>
    <h1 class="md-title">{{ documentation.title }}</h1>
    <div
      v-for="(item, index) in documentation.content"
      :key="index"
      class="documentation__content">
      <rich-text v-if="item.text" :text="item.text" />
      <responsive-image v-if="item.image" :image="item.image" />
    </div>
  </md-drawer>
</template>

<script>
import { RichText, ResponsiveImage } from '~/components'
import getData from '~/lib/get-data'

export default {
  middleware: ['state-is-inactive'],
  components: { RichText, ResponsiveImage },
  async asyncData({ params, store }) {
    const { locale } = store.state.i18n
    const { documentation } = await getData({ locale, slug: 'documentation' })
    return { documentation }
  },
}
</script>

<style>
.documentation {
  width: var(--width-large);
  padding: var(--spacing-double);
}

.documentation .md-link {
  margin: 0;
  padding: 0;
  color: var(--action-color);
  display: block;
  margin-left: auto;
  margin-bottom: var(--spacing-double);
}
</style>
