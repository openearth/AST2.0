import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { withReadme } from 'storybook-readme'
import { withKnobs } from '@storybook/addon-knobs/vue'

import '../app-core/index.css'

import MeasureCard from './measure-card.vue'
import README from './README.md'

const stories = storiesOf('Measure Card', module)
  .addDecorator(withKnobs)
  .addDecorator(withReadme(README))

Vue.component('measure-card', MeasureCard)

stories.add(
  'Measure Card',
  () => ({
    data() {
      return {
        measure: {
          "title": "Cooling with water elements: fountains",
          "body": "<p>A fountain pours water into a basin or jets it into the air to supply water or for a decorative or dramatic effect.</p>",
          "color": {
            "hex": "#772D8B",
          },
          "image": {
            "format": "png",
            "url": "https://www.datocms-assets.com/7033/1535639285-iconen-11.png",
            "height": 417,
            "width": 417,
          },
        },
      }
    },
    template: '<measure-card :measure="measure"/>',
  }),
)
