<template>
  <aside class="areas">
    <h1>{{ $t('your_measures') }}</h1>
    <ul class="areas__list">
      <li
        v-for="feature in selectedFeatures"
        :key="feature.id"
        class="areas__list-item">
        <div class="areas__list-item__header">
          <button
            :class="{ 'icon-eye--disabled' : visibleAreas.includes(feature.id) }"
            class="areas__list-item__button icon-eye" />

          <p>{{ feature.properties.name }}</p>
          <button
            for="area-properties"
            type="submit"
            class="button button--primary areas__list__submit-button"
            @click.prevent="onSubmit">
            Done
          </button>
        </div>
        <div class="area__measure">
          <p class="area__measure__title">Measure:</p>
          <div class="area__measure__content">
            <div>
              <p v-if="appliedMeasure" class="area__measure__measure-title">{{ appliedMeasure.title }}</p>
              <nuxt-link class="button" to="measures">{{ feature.properties.measure ? 'Change measure' : 'Choose measure' }}</nuxt-link>
            </div>
            <div :style="appliedMeasure ? `background-image: url(${ appliedMeasure.image.url })` : ''" class="area__measure__image"/>
          </div>
          <form
            id="area-properties"
            class="area__measure__form"
            name="area-properties"
            @submit.prevent="onSubmit">

            <fieldset v-if="appliedMeasure" >
              <label class="label" for="depth">Area depth(m)</label>
              <div class="input-range">
                <input
                  v-model="areaDepth"
                  min="0" 
                  max="10"
                  step="1"
                  type="range" 
                  name="depth">
                <span class="output">{{ areaDepth }}</span>
              </div>
              

              <label class="label" for="inflow">Area inflow(m2)</label>
              <div class="input-range">
                <input
                  v-model="areaInflow"
                  min="0"
                  max="10"
                  step="1"
                  type="range" 
                  name="inflow">
                <span class="output">{{ areaInflow }}</span>
              </div>
              
            </fieldset>

            <fieldset>
              <label class="text--uppercase" for="area-name">Area name</label>
              <input
                id="area-name"
                v-model="areaName"
                :placeholder="feature.properties.name"
                class="area__measure__form__input"
                type="text"
                name="area-name">
            </fieldset>

            <fieldset>
              <legend class="text--uppercase">Layer color</legend>

              <label>
                <input
                  id="layer-color"
                  v-model="layerColor"
                  class="area__measure__form__input"
                  type="color"
                  name="layer-color">
                Change layer color
              </label>
            </fieldset>
          </form>
        </div>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      visibleAreas: [],
      updatedAreaId: '',
      areaName: '',
      layerColor: "#1C37F8",
      areaDepth: 0,
      areaInflow: 0,
    }
  },
  computed: {
    ...mapGetters('data/measures', ['getMeasureById']),
    ...mapGetters({
      selectedFeatures: 'selectedAreas/features',
    }),
    selectedMeasuresIds() { return this.selectedFeatures.map(feature => feature.properties.measure) },
    appliedMeasure() { 
      const id = this.selectedMeasuresIds.join()
      return this.getMeasureById(id)
    },
  },
  methods: {
    ...mapMutations({
      updateAreaProperty: 'project/updateAreaProperty',
    }),
    getMeasureById(id) {
      return this.appliedMeasures.find(measure => measure.measureId === id)
    },
    onSubmit() {
      this.updateAreaProperty({
        id: this.updatedAreaId,
        properties: {
          name: this.areaName,
          layerColor: this.layerColor,
        },
      })
    },
    updateAreaId(id) {
      this.updatedAreaId = id
    },
  },
}
</script>

<style>
.areas {
  background-color: var(--neutral-color);
  width: 350px;
}

.areas__list {
  padding: 0;
}

.areas__list-item {
  list-style-type: none;
  border-bottom: 1px solid #e0e0e0;
}

.areas__list-item__header {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  box-shadow: 1px 1px 5px #ddd;
  padding: .5rem 1rem;
  margin-bottom: 1rem;
}

.areas__list__submit-button {
  margin-left: auto;
  padding: .3rem var(--spacing-half);
}

.areas__list-item__button {
  margin-right: var(--spacing-half);
  padding: 0;
  background-position: center;
  background-repeat: no-repeat;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.icon-eye {
  background-image: url('/images/eye.svg');
  background-size: 18px;
  opacity: 1;
}

.icon-eye--disabled {
  opacity: .3;
}

.area__measure {
  margin: 0 1rem;
  padding-bottom: 1rem;
}

.area__measure__title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: .5rem;
}

.area__measure__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  padding: 2rem;
  padding-left: 1rem;
  margin-bottom: 1rem;
}

.area__measure__image {
  width: 80px;
  height: 80px;
  background-color: var(--neutral-color--light);
  border: 1px dashed var(--neutral-color--medium);
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.area__measure__form {
  display: flex;
  flex-direction: column;
}

.area__measure__form__input {
  display: block;
}

fieldset {
  border: none;
  padding: 0;
}

legend {
  margin-bottom: .5rem;
  font-size: 12px;
}

label {
  line-height: 30px;
  font-size: 12px;
  margin-bottom: var(--spacing-half);
  color: var(--neutral-color-medium);
  display: flex;
}

input {
  padding: var(--spacing-half);
  margin-right: .5rem;
}

input[type='color'] {
  padding: 0;
  border: none;
  width: 80px;
  height: 30px;
  border-radius: var(--border-radius-small);
}

input[type='text'] {
  margin-bottom: var(--spacing-default);
}

.area__measure__measure-title {
  margin-bottom: 1rem;
  flex-shrink: 1;
  margin-right: .5rem;
}

input[type='range'] {
  display: inline-block;
  width: 260px;
  appearance: none;
  background: transparent;
}

/* Special styling for WebKit/Blink */
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #000000;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
  margin-top: -8px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
}

/* All the same stuff for Firefox */
input[type=range]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #000;
  cursor: pointer;
}
/* All the same stuff for IE */
input[type=range]::-ms-thumb {
  border: 1px solid #000000;
  height: 36px;
  width: 16px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: #D8D8D8;
  border-radius: 5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #D8D8D8;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: #D8D8D8;
  border-radius: 5px;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #D8D8D8;
  border-radius: 2.5px;
}
input[type=range]:focus::-ms-fill-lower {
  background: #D8D8D8;
}
input[type=range]::-ms-fill-upper {
  background: #D8D8D8;
  border-radius: 2.5px;
}
input[type=range]:focus::-ms-fill-upper {
  background: #D8D8D8;
}

.output {
  width: 40px;
  height: 30px;
  background-color: var(--background-color);
  border: 1px solid var(--neutral-color--medium);
  flex-shrink: 0;
  text-align: center;
}

.input-range {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-default);
}

.label {
  margin-bottom: 0;
}
</style>

