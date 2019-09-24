const html = str => str.raw[0]; // For editor code highlight

const template = html`
<div id="searchbox" class="searchbox">
	<label>
		<span>Find measures:</span>
		<input
			ref="input"
			class="searchfield"
			type="text"
			v-model="searchQuery"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down="selectDown"
			@keydown.up="selectUp"
			@keydown.enter="selectItem"
		>
	</label>
	<ul class="autocomplete-results" ref="resultlist">
		<li
			class="autocomplete-result"
      v-for="(item, index) in searchResult"
			:key="item.id"
			:class="{'autocomplete-result--active': selectedIndex === index}"
      :data-index="index"
      @click="emit(item)"
      @mouseenter="selectIndex(index)"
		>
			{{item.title.en}}
		</li>
	</ul>
</div>
`

Vue.component('auto-complete', {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    filterItems: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    selectedItems: [],
		inputFocused: false,
		searchQuery: '',
		selectedIndex: undefined,
	}),
	computed: {
		searchResult() {
			if (this.searchQuery === '' && this.inputFocused === false) return []

      const search = new RegExp(this.searchQuery, 'i')
      return this.items
        .filter(measure => search.test(measure.title.en))
        .filter(measure => !this.filterItems.includes(measure.measureId))
        .filter(measure => !this.selectedItems.includes(measure.measureId))
		},
	},
	watch: {
		searchQuery() {
			this.selectedIndex = undefined
		},
	},
	methods: {
		onFocus(index = undefined) {
			this.inputFocused = true
			this.selectedIndex = undefined
		},
		onBlur() {
      this.$refs.resultlist.style.opacity = 0
      setTimeout(() => {
        this.inputFocused = false
        this.$refs.resultlist.style.opacity = 1
    }, 1000)
		},
		selectItem() {
			if (this.selectedIndex !== undefined) {
        this.emit(this.searchResult[this.selectedIndex])
        this.selectedIndex = undefined
			}
    },
    emit(item) {
      this.$emit('select-item', item)
      this.selectedItems.push(item)
    },
    selectIndex(index) {
      this.selectedIndex = Number(index)
    },
		selectDown() {
			const list = this.$refs.resultlist.querySelectorAll('li')
			const first = _.first(list)
			const last = _.last(list)
			const lastIndex = Number(last.dataset.index)

      if (this.selectedIndex === undefined ) {
				this.selectedIndex = Number(first.dataset.index)
			} else if (lastIndex > this.selectedIndex) {
				this.selectedIndex += 1;
			} else if (lastIndex === this.selectedIndex) {
				this.selectedIndex = undefined;
			}
		},
		selectUp() {
			const list = this.$refs.resultlist.querySelectorAll('li')
			const first = _.first(list)
			const last = _.last(list)
			const lastIndex = Number(last.dataset.index)

			if (this.selectedIndex === undefined ) {
				this.selectedIndex = lastIndex
			} else if (this.selectedIndex > 0) {
				this.selectedIndex -= 1;
			} else if (this.selectedIndex === 0) {
				this.selectedIndex = undefined;
			}
		},
	},
  template,
})
