import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import NotificationArea from './notification-area.vue'
import README from './README.md'

const stories = storiesOf('Notification Area', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('notification-area', NotificationArea)

stories.add(
  'Notification Area',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<notification-area/>',
  }),
)
