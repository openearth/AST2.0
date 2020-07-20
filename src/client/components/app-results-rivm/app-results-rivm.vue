<template>
  <article class="app-results-rivm">
    <div class="app-results-rivm__content">
      <section
        v-for="section in rivmData"
        :key="section.title"
        class="app-results-rivm__data-section"
      >
        <header>
          <h5 v-html="section.title" />
        </header>
        <dl class="app-results-rivm__definition-list">
          <template v-for="definition in section.definitions">
            <dt :key="`${definition.title}-term`" v-html="definition.title" />
            <dd :key="`${definition.title}-definition`">
              <span>{{ definition.value }}</span>
              <span class="app-results-rivm__unit">{{ definition.unit }}</span>
            </dd>
          </template>
        </dl>
      </section>
    </div>

    <footer class="app-results-rivm__footer">
      <md-button class="app-results-rivm__cta md-raised">Bereken groene baten</md-button>
    </footer>
  </article>
</template>

<script>
export default {
  data() {
    return {
      rivmData: [
        {
          title: 'Gezondheid',
          definitions: [
            { title: 'Vermeden gezondheidskosten', value: -12000, unit: '€/jr' },
            { title: 'Vermeden kosten voor arbeidsverlies', value: -12000, unit: '€/jr' },
          ],
        },
        {
          title: 'Mobiliteit',
          definitions: [
            { title: 'Vermeden vroegtijdige sterfgevallen door fietsen woon/werkverkeer', value: -12000, unit: '€/jr' },
          ],
        },
        {
          title: 'Lucht regulatie',
          definitions: [
            { title: 'Depositie van fijnstof', value: -12000, unit: '€/jr' },
          ],
        },
        {
          title: 'CO<sub>2</sub> opslag',
          definitions: [
            { title: 'Opslag van CO<sub>2</sub>', value: -12000, unit: '€/jr' },
          ],
        },
        {
          title: 'Vastgoedwaarde',
          definitions: [
            { title: 'Meerwaarde van woningen', value: -12000, unit: '€' },
          ],
        },
      ],
    }
  },
}
</script>

<style>
.app-results-rivm {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-results-rivm__content {
  flex: 1;
}

.app-results-rivm__footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-left: calc(-1 * var(--spacing-default));
  width: calc(100% + (var(--spacing-default) * 2));

  padding: var(--spacing-half);

  text-align: right;
  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}

.app-results-rivm__cta.md-button.md-theme-default.md-raised:not([disabled]) {
  background-color: var(--nature-green-color);
  color: var(--neutral-color);
}

.app-results-rivm__data-section {
  margin-bottom: 1rem;
}

.app-results-rivm__definition-list {
  display: grid;
  column-gap: 1rem;
  grid-template-columns: 1fr max-content;
}

.app-results-rivm__unit::before {
  content: ' ['
}
.app-results-rivm__unit::after {
  content: ']'
}
</style>
