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
			this.selectedIndex = index
		},
		onBlur() {
      console.log('on blur')
      setTimeout(() => {
        console.log('execute on blur')
        this.inputFocused = false
        this.selectedIndex = undefined
      }, 40)
		},
		selectItem() {
			if (this.selectedIndex !== undefined) {
        this.emit(this.items[this.selectedIndex])
        this.selectedIndex = undefined
			}
    },
    emit(item) {
      console.log('emit')
      this.$emit('select-item', item)
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
