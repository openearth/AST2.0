import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'
import VueI18n from 'vue-i18n'
// import { action } from '@storybook/addon-actions'

import '../app-core/index.css'

import ProjectImport from './project-import.vue'
import README from './README.md'

const stories = storiesOf('Components/Project Import', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('project-import', ProjectImport)

stories.add(
  'Project Import',
  () => ({
    i18n: new VueI18n({ locale: 'en' }),
    template: '<project-import/>',
  }),
)
