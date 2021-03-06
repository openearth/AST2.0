import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import ImageCarousel from './image-carousel.vue'
import README from './README.md'

const stories = storiesOf('Image Carousel', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('image-carousel', ImageCarousel)

stories.add(
  'Image Carousel',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<image-carousel/>',
  }),
)
