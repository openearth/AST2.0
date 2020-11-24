<template>
  <md-drawer md-permanent="clipped" class="page">
    <back-button />
    <h1 class="md-title">
      {{ documentation.title }}
    </h1>
    <div
      v-for="(item, index) in documentation.content"
      :key="index"
    >
      <rich-text v-if="item.text" :text="item.text" />
      <responsive-image v-if="item.image" :image="item.image" />
    </div>
  </md-drawer>
</template>

<script>
import { RichText, ResponsiveImage, BackButton } from '~/components'
import getData from '~/lib/get-data'

export default {
  middleware: ['state-is-inactive'],
  components: { RichText, ResponsiveImage, BackButton },
  async asyncData({ store }) {
    const { locale } = store.state.i18n
    const { documentation } = await getData({ locale, slug: 'documentation' })
    return { documentation }
  },
}
</script>
