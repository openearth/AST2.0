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
            @click="() => console.log('toggle')" />

          <p>{{ feature.properties.name }}</p>
          <button
            for="area-properties"
            type="submit"
            class="areas__list__submit-button button--primary"
            @click="() => console.log('submit from btn')">
            Done
          </button>
        </div>
        <div>
          <p>Measure:</p>
          <div>
            <nuxt-link to="measures">Choose measure</nuxt-link>
            <div class="image" />
          </div>
        </div>
        <form name="area-properties" @submit.prevent="() => console.log('submit form')">
          <input type="text">
        </form>
        <pre>{{ feature }}</pre>
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
    }
  },
  computed: {
    ...mapGetters({
      selectedFeatures: 'selectedAreas/features',
    }),
  },
}
</script>

<style>
.areas__list {
  padding: 0;
}

.areas__list-item {
  list-style-type: none;
}

.areas__list-item__header {
  display: flex;
  align-items: center;
  background-color: var(--background-color);
  box-shadow: 1px 1px 5px #ddd;
  padding: .5rem 1rem;
}

.areas__list__submit-button {
  margin-left: auto;
  background-color: #696969;
  color: var(--background-color);
  padding: .3rem .5rem;
  border: none;
  border-radius: var(--border-radius-small);
}

.areas__list__submit-button:hover {
  background-color: var(--text-light-color);
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
</style>

