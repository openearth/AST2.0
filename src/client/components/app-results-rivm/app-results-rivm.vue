<template>
  <article class="app-results-rivm">
    <div
      v-if="transformedData.length === 0 && !isLoading"
      class="app-results-rivm__content"
      v-html="datoContent.greenBenefitsNoDataLoadedYet"
    />
    <div
      v-else-if="transformedData.length === 0 && isLoading"
      class="app-results-rivm__content"
      v-html="datoContent.greenBenefitsCalculatingResults"
    />
    <div
      v-else
      class="app-results-rivm__content"
    >
      <section
        v-for="section in transformedData"
        :key="section.model"
        class="app-results-rivm__data-section"
      >
        <header>
          <h5 class="app-results-rivm__section-title md-body-2">
            {{ section.title }}
          </h5>
        </header>
        <dl class="app-results-rivm__definition-list">
          <template v-for="definition in section.definitions">
            <dt
              :key="`${ definition.code }-term`"
              class="md-body-1"
            >
              <span v-html="definition.text" />
              <span> ({{ definition.unit }}):</span>
            </dt>
            <dd
              :key="`${ definition.code }-definition`"
              class="md-body-1 app-results-rivm__value"
            >
              {{ definition.value }}
            </dd>
          </template>
        </dl>
      </section>
    </div>

    <footer v-if="showFooter" class="app-results-rivm__footer">
      <small class="app-results-rivm__footer__received-at">
        <strong>{{ datoContent.lastCalculation }}:</strong>
        <span>{{ receivedAt }}</span>
      </small>
      <div class="app-results-rivm__buttons-wrapper">
        <md-button
          class="md-raised"
          :href="datoContent.greenBenefitsDocumentationLinkAddress"
          target="_blank"
        >
          {{ datoContent.documentationLinkText }}
        </md-button>
        <div class="app-results-rivm__footer-cta-wrapper">
          <md-button
            :disabled="isLoading"
            class="app-results-rivm__cta md-raised"
            @click="handleFetchData"
          >
            {{ datoContent.greenBenefitsCtaText }}
          </md-button>
          <md-progress-spinner
            v-if="isLoading"
            :md-diameter="30"
            :md-stroke="3"
            class="app-results-rivm__loading-indicator"
            md-mode="indeterminate"
          />
        </div>
      </div>
    </footer>
  </article>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    datoContent: {
      type: Object,
      default: () => ({}),
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isLoading: false,
  }),
  computed: {
    receivedAt() {
      try {
        const { receivedAt } = this.data
        if(!receivedAt) throw 'date undefined'
        const date = new Date(receivedAt)
        return date.toLocaleString()
      }
      catch (error) {
        return '-'
      }
    },
    transformedData(){
      try {
        return this.data.entries
          .map(({ code, name, tablevalue, units, model, modelDescription }) => ({
            code,
            text: name.trim(),
            value: tablevalue,
            unit: units,
            model,
            modelDescription,
          }))
          // Group items by model
          .reduce((sections, item) => {
            let section = sections.find(({ model }) => model === item.model)
            if (!section) {
              section = { model: item.model, title: item.modelDescription, definitions: [] }
              sections.push(section)
            }
            section.definitions.push(item)
            return sections
          }, [])
      }
      catch (error) {
        return []
      }
    },
  },
  watch: {
    receivedAt() {
      this.isLoading = false
    },
  },
  methods: {
    handleFetchData() {
      this.isLoading = true
      this.$emit('fetch-data')
    },
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
  display: grid;
  grid-template-columns: auto min-content;
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-left: calc(-1 * var(--spacing-default));
  width: calc(100% + (var(--spacing-default) * 2));

  padding: var(--spacing-half);

  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}

.app-results-rivm__footer__received-at {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: var(--spacing-quarter);
}

.app-results-rivm__buttons-wrapper,
.app-results-rivm__footer-cta-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-results-rivm__cta.md-button.md-theme-default.md-raised:not([disabled]) {
  background-color: var(--nature-green-color);
  color: var(--neutral-color);
}

.app-results-rivm__loading-indicator {
  position: absolute;
  top: calc(50% - 15px); /* 15px is half of the with. somehow translate does not have any effect */
  left: calc(50% - 25px); /* 15px is half of the with. somehow translate does not have any effect */
  --md-theme-default-primary: var(--nature-green-color);
}

.app-results-rivm__data-section {
  margin-bottom: var(--spacing-default);
}

.app-results-rivm__section-title {
  margin-bottom: var(--spacing-half);
}

.app-results-rivm__definition-list {
  display: grid;
  column-gap: var(--spacing-default);
  grid-template-columns: 1fr max-content;
}

.app-results-rivm__definition-list > * {
  margin-bottom: var(--spacing-default)
}

.app-results-rivm__value {
  text-align: right;
}
</style>
