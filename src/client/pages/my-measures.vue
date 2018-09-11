<template>
  <aside class="my-measures">
    <header class="my-measures__header">
      <h2 class="my-measures__header__title">{{ $t('my_measures') }}</h2>
    </header>

    <section class="my-measures__list-container">
      <ul class="my-measures__list">
        <li
          v-for="(measure, index) in chosenMeasuresList"
          :key="index"
          :style="`border-left-color: ${measure.color.hex}`"
          class="my-measures__list__item">
          
          <button 
            :class="{ 'icon-eye--disabled' : !isAreaVisible }" 
            class="my-measures__list__item__button icon-eye" 
            @click="toggleAreaVisibility" />
          
          <button 
            :class="{'icon-triangle--down' : isAreasListVisible }" 
            class="my-measures__list__item__button icon-triangle"
            @click="toggleListVisibility"/>
          
          <div :style="`background-image: url(${measure.image.url}`" class="my-measures__list__item__image" />
          
          <span class="my-measures__list__item__title">{{ measure.title }}</span>
        </li>
      </ul>
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
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    chosenMeasuresIds() { return this.areas.map(area => area.properties.measure)},
    chosenMeasuresList() { return this.measures.filter(measure => {
      if (this.chosenMeasuresIds.includes(measure.measureId)) {
        return measure
      }
    })},
  },
  methods: {
    toggleAreaVisibility() {
      this.isAreaVisible = !this.isAreaVisible
    },
    toggleListVisibility() {
      this.isAreasListVisible = !this.isAreasListVisible
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

.my-measures__list__item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: var(--spacing-default);
  width: 100%;
  font-size: var(--font-size-default);
  font-weight: bold;
  list-style-type: none;
  border-bottom: 1px solid #F2F2F2;
  border-left: 5px solid;
}

.my-measures__list__item__button {
  margin-right: var(--spacing-half);
  padding: 0;
  background-position: center;
  background-repeat: no-repeat;
  width: 30px;
  height: 30px;
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
