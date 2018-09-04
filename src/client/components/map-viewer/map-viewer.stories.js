import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import MapViewer from './map-viewer.vue'
import README from './README.md'

const stories = storiesOf('Map Viewer', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('map-viewer', MapViewer)

stories.add(
  'Map Viewer',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<map-viewer/>',
  }),
)
