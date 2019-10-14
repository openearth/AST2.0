import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import LayerLegend from './layer-legend.vue'
import README from './README.md'

const stories = storiesOf('Layer legend', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('layer-legend', LayerLegend)

stories.add(
  'Layer legend',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<layer-legend/>',
  }),
)
