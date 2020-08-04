<template>
  <div class="search-input">
    <div
      :class="{ 'search-input--visible' : show }"
      class="search-input__input"
    >
      <text-input
        v-model="value"
        type="text"
        placeholder="Search"
        @input="$emit('search', value)"
        @keyup.enter="() => suggestions.length && fly(suggestions[0])"
        @blur="() => $emit('hide')"
      >
        <md-button
          class="md-icon-button md-dense"
          @click="() => suggestions.length && fly(suggestions[0])"
        >
          <md-icon>search</md-icon>
        </md-button>
      </text-input>
    </div>
    <transition-group
      v-if="suggestions.length"
      class="search-input__suggestions"
      tag="ul"
      name="suggestions-list"
    >
      <li
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="search-input__suggestion"
      >
        <button class="search-input__suggestion-button" @mousedown="() => fly(suggestion)">
          {{ suggestion['place_name'] }}
        </button>
      </li>
    </transition-group>
  </div>
</template>

<script>
import  MapEventBus, { SEARCH_SUGGESTIONS, REPOSITION } from '../../lib/map-event-bus';
import TextInput from "~/components/text-input";

export default {
  components: { TextInput },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: '',
      suggestions: [],
    }
  },
  mounted() {
    MapEventBus.$on(SEARCH_SUGGESTIONS, (items) => {
      console.log({ items })
      this.suggestions = items
    })
  },
  methods: {
    fly(suggestion) {
      MapEventBus.$emit(REPOSITION, {
        center: suggestion.center,
        zoom: 16,
      })
      this.$emit('hide')
    },
  },
}
</script>

<style>
.search-input {
  position: relative;
}

.search-input__input {
  width: 0;
  padding: var(--spacing-half);
  border: none;
  border-radius: 50%;
  opacity: 0;
  box-shadow: var(--shadow-small-grey);
  animation: show .5s ease-in-out;
  background-color: white;
}

.search-input__input .md-field {
  min-height: 0;
  margin: 0;
  padding: 0;
}

.search-input--visible {
  animation: show .5s ease-in-out forwards;
}

.search-input__suggestions {
  background-color: white;
  padding: .5rem;
  width: 350px;
  text-align: left;
  position: absolute;
}
.search__icon {
  position: absolute;
  top: calc(100% + 2px);
}

.search-input__suggestion {
  list-style-type: none;
  white-space: normal;
}

.search-input__suggestion-button {
  text-align: left;
  font-size: 14px;
  padding: .5rem 0;
}

.search-input__suggestion-button:hover {
  color: var(--action-color);
}

.suggestions-list {
  transition: all 0.5s;

}
.suggestions-list-enter, .suggestions-list-leave-to {
  opacity: 0;
  transform: scale(0);
}

.suggestions-list-enter-to {
  opacity: 1;
  transform: scale(1);
}

.suggestions-list-move {
  opacity: 1;
  transition: all 0.5s;
}

@keyframes show {
  0% {
    width: 0;
    border-radius: 50%;
    opacity: 0;
  }

  50% {
    border-radius: 5px;
    opacity: 1;
  }

  100% {
    width: 350px;
    opacity: 1;
    border-radius: 5px;
  }
}
</style>
