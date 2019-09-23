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
	<ul class="search-results" ref="resultlist">
		<li
			class="search-result"
			v-for="(item, index) in searchResult"
			:key="item.id"
			:class="{'search-result--active': selectedIndex === index}"
			:data-index="index"
		>
			{{item.title.en}}{{selectedIndex === index ? '(selected)': ''}}
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
        .filter(measure => !this.items.includes(measure.measureId))
		},
	},
	watch: {
		searchQuery() {
			this.selectedIndex = undefined
		},
	},
	methods: {
		onFocus() {
			this.inputFocused = true
			this.selectedIndex = undefined
		},
		onBlur() {
			this.inputFocused = false
			this.selectedIndex = undefined
		},
		selectItem() {
			if (this.selectedIndex !== undefined) {
				this.$emit('select-item', this.items[this.selectedIndex])
			}
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
				this.selectedIndex = 0;
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
				this.selectedIndex = lastIndex;
			}
		},
	},
  template,
})