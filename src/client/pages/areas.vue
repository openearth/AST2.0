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
            class="areas__list-item__button icon-eye"
            @click.prevent="() => console.log('toggle')" />

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
              <!-- <p v-if="feature.properties.measure">{{ feature.properties.measure }}</p> -->
              <nuxt-link class="button" to="measures">{{ feature.properties.measure ? 'Change measure' : 'Choose measure' }}</nuxt-link>
            </div>
            <div class="area__measure__image" />
          </div>
          <form
            id="area-properties"
            class="area__measure__form"
            name="area-properties"
            @submit.prevent="onSubmit">

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
                  value="#fff"
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
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      visibleAreas: [],
      areaName: '',
      layerColor: '',
    }
  },
  computed: {
    ...mapGetters({
      selectedFeatures: 'selectedAreas/features',
    }),
  },
  methods: {
    onSubmit() {
      console.log(this.areaName)
      console.log(this.layerColor)
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
</style>

