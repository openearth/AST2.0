<template>
  <aside class="areas">
    <h1>{{ $t('your_measures') }}</h1>

    <ul class="areas__list">
      <li
        v-for="feature in selectedFeatures"
        :key="feature.id"
        class="areas__list-item">

        <div :style="`border-color: ${feature.properties.color || '#1C37F8'}`" class="areas__list-item__header">
          <button
            :class="{ 'icon-eye--disabled' : visibleAreas.indexOf(feature.id) !== -1 }"
            class="areas__list-item__button icon-eye" />

          <p>{{ feature.properties.name }}</p>

          <button
            for="area-properties"
            type="submit"
            class="button button--primary areas__list__submit-button"
            @click.prevent="() => onSubmit(feature.id, feature.properties.name)">
            Done
          </button>
        </div>

        <div class="area__measure">
          <p class="area__measure__title">{{ $t('measure') }}</p>

          <div class="area__measure__content">
            <div>
              <p v-if="appliedMeasure" class="area__measure__measure-title">{{ appliedMeasure.title }}</p>
              <nuxt-link :class="appliedMeasure ? 'link' : 'button'" to="measures">
                {{ feature.properties.measure ? $t('change_measure') : $t('choose_measure') }}
              </nuxt-link>
            </div>

            <div :style="appliedMeasure ? `background-image: url(${ appliedMeasure.image.url }); border: none;` : ''" class="area__measure__image"/>
          </div>

          <form
            id="area-properties"
            class="area__measure__form"
            name="area-properties"
            @submit.prevent="() => onSubmit(feature.id, feature.properties.name)">

            <fieldset v-if="appliedMeasure" >
              <label class="label" for="depth">{{ $t('area_depth') }}(m)</label>
              <div class="input-range">
                <input
                  :value="feature.properties.areaDepth || 0"
                  min="0"
                  max="10"
                  step="1"
                  type="range"
                  name="depth"
                  @change="e => updateAreaProperty({ id: feature.id, properties: { areaDepth: e.target.value }})">
                <span class="output">{{ feature.properties.areaDepth || 0 }}</span>
              </div>

              <label class="label" for="inflow">{{ $t('area_inflow') }}(m2)</label>
              <div class="input-range">
                <input
                  :value="feature.properties.areaInflow || 0"
                  min="0"
                  max="10"
                  step="1"
                  type="range"
                  name="inflow"
                  @change="e => updateAreaProperty({ id: feature.id, properties: { areaInflow: e.target.value }})">
                <span class="output">{{ feature.properties.areaInflow || 0 }}</span>
              </div>
            </fieldset>

            <fieldset>
              <label class="text--uppercase" for="area-name">{{ $t('area_name') }}</label>
              <input
                id="area-name"
                :value="areaName || feature.properties.name"
                :placeholder="feature.properties.name"
                class="area__measure__form__input"
                type="text"
                name="area-name"
                @change="(e) => areaName = e.target.value">
            </fieldset>

            <!-- <fieldset>
              <legend class="text--uppercase">{{ $t('layer_color') }}</legend>

              <label>
                <input
                  id="layer-color"
                  v-model="layerColor"
                  class="area__measure__form__input"
                  type="color"
                  name="layer-color">
                {{ $t('change_layer_color') }}
              </label>
            </fieldset> -->
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
      areaName: '',
      // updatedAreaId: '',
      // layerColor: "#1C37F8",
    }
  },
  computed: {
    ...mapGetters('data/measures', ['measureById']),
    ...mapGetters({ selectedFeatures: 'selectedAreas/features' }),
    selectedMeasuresIds() { return this.selectedFeatures.map(feature => feature.properties.measure) },
    appliedMeasure() {
      const id = this.selectedMeasuresIds.join()
      return this.measureById(id)
    },
  },
  methods: {
    ...mapMutations({ updateAreaProperty: 'project/updateAreaProperty' }),
    onSubmit(id, currentName) {
      const name = this.areaName === '' ? currentName : this.areaName

      this.updateAreaProperty({
        id,
        properties: {
          name,
        },
      })
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
  padding: var(--spacing-half) var(--spacing-default);
  margin-bottom: var(--spacing-default);
  border-left: 5px solid;
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
  margin: 0 var(--spacing-default);
  padding-bottom: var(--spacing-default);
}

.area__measure__title {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: var(--spacing-half);
}

.area__measure__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  padding: var(--spacing-double);
  padding-left: var(--spacing-default);
  margin-bottom: var(--spacing-default);
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

legend {
  margin-bottom: var(--spacing-half);
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
  margin-right: var(--spacing-half);
  width: 100%;
}

input[type='text'] {
  margin-bottom: var(--spacing-default);
}

.area__measure__measure-title {
  margin-bottom: var(--spacing-default);
  flex-shrink: 1;
  margin-right: var(--spacing-half);
}

input[type='range'] {
  display: inline-block;
  width: 260px;
}

.output {
  flex-shrink: 0;
  text-align: center;
  line-height: 30px;
  width: 40px;
  height: 30px;
  background-color: var(--background-color);
  border: 1px solid var(--neutral-color--medium);
  border-radius: var(--border-radius-small);
}

.input-range {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-default);
}

.label {
  margin-bottom: 0;
}
</style>
