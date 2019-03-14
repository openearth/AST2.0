<template>
  <md-drawer md-permanent="clipped" class="page">
    <button class="md-link" @click="$router.go(-1)">&#x2190; {{ $t('back') }}</button>
    <h1 class="md-title">{{ about.title }}</h1>
    <div
      v-for="(item, index) in about.content"
      :key="index">
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
    const { about } = await getData({ locale, slug: 'about' })
    return { about }
  },
}
</script>
