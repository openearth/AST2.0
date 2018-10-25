import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import LayerList from './layer-list.vue'
import README from './README.md'

const stories = storiesOf('Layer List', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('layer-list', LayerList)

stories.add(
  'Layer List',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<layer-list/>',
  }),
)
