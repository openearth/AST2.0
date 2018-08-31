import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import ProjectExport from './project-export.vue'
import README from './README.md'

const stories = storiesOf('Components/Project Export', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('project-export', ProjectExport)

stories.add(
  'Project Export',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<project-export/>',
  }),
)
