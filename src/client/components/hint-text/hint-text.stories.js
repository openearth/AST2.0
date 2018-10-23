import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import HintText from './hint-text.vue'
import README from './README.md'

const stories = storiesOf('Hint Text', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('hint-text', HintText)

stories.add(
  'Hint Text',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<hint-text/>',
  }),
)
