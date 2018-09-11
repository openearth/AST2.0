<template>
  <aside class="my-measures">
    <header class="my-measures__header">
      <h2 class="my-measures__header__title">{{ $t('your_measures') }}</h2>
    </header>

    <section class="my-measures__list-container">
      <ul v-if="measureCollection.length" class="my-measures__list">
        <li
          v-for="({measure, areas}, index) in measureCollection"
          :key="index"
          :style="`border-left-color: ${measure.color.hex}`"
          class="my-measures__list__item">
          <div class="my-measures__item-content">
            <button
              :class="{ 'icon-eye--disabled' : !isAreaVisible }"
              class="my-measures__list__button icon-eye"
              @click="toggleAreaVisibility" />

            <button
              :class="{'icon-triangle--down' : shownAreaIds.indexOf(measure.measureId) !== -1 }"
              class="my-measures__list__button icon-triangle"
              @click="toggleListVisibility(measure.measureId)"/>

            <div :style="`background-image: url(${measure.image.url}`" class="my-measures__list__item__image" />

            <span class="my-measures__list__item__title">{{ measure.title }}</span>
          </div>

          <ul v-if="shownAreaIds.indexOf(measure.measureId) !== -1" class="my-measures__item-areas">
            <li
              v-for="area in areas"
              :key="area.id"
              class="my-measures__item-area">

              <button
                :class="{ 'icon-eye--disabled' : !isAreaVisible }"
                class="my-measures__list__button icon-eye"
                @click="toggleAreaVisibility" />

              <span>{{ area.id }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <p v-else class="my-measures__text">{{ $t('empty_measures') }}</p>
    </section>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput } from '~/components'

export default {
  components: { MeasureCard, SearchInput },
  data() {
    return {
      isAreasListVisible: false,
      isAreaVisible: true,
      shownAreaIds: [],
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure']),
    measureCollection() {
      return Object.keys(this.areasByMeasure).map(key => this.areasByMeasure[key])
    },
  },
  methods: {
    toggleAreaVisibility(measureId) {
      this.isAreaVisible = !this.isAreaVisible
    },
    toggleListVisibility(measureId) {
      if (this.shownAreaIds.indexOf(measureId) === -1) {
        this.shownAreaIds.push(measureId)
      } else {
        this.shownAreaIds.splice(this.shownAreaIds.indexOf(measureId), 1)
      }
    },
  },
}
</script>

<style>
.my-measures {
  width: 350px;
}

.my-measures__header__title {
  padding: var(--spacing-default);
  font-size: var(--font-size-default);
}

.my-measures__list {
  padding: 0;
}

.my-measures__text {
  padding: var(--spacing-default);
}

.my-measures__list__item {
  display: flex;
  flex-direction: column;
  width: 100%;
  list-style-type: none;
  border-bottom: 1px solid #F2F2F2;
  border-left: 5px solid;
  font-size: var(--font-size-default);
  font-weight: bold;
}

.my-measures__item-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: var(--spacing-default);
}

.my-measures__item-areas {
  display: flex;
  flex-direction: column;
  list-style-type: none;
}

.my-measures__item-area {
  display: flex;
  align-items: center;
  width: 100%;
}

.my-measures__list__button {
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

.icon-triangle {
  background-image: url('/images/triangle.svg');
  background-size: 15px;
  transform: rotate(-90deg);
  transition: transform .2s ease-in-out;
}

.icon-triangle--down {
  transform: rotate(0);
}

.my-measures__list__item__image {
  margin-right: var(--spacing-default);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
}

.my-measures__list__item__title {
  max-width: 200px;
}
</style>
