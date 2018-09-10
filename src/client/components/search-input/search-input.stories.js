import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import SearchInput from './search-input.vue'
import README from './README.md'

const stories = storiesOf('Search Input', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('search-input', SearchInput)

stories.add(
  'Search Input',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<search-input/>',
  }),
)
