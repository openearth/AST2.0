<template>
  <aside :class="{ 'measure-aside__wide': isWide }" class="measure-aside">
    <slot/>
    <footer class="measure-aside__footer">
      <md-button class="md-raised measure-aside__btn-cancel" @click="cancel">Cancel</md-button>
    </footer>
  </aside>
</template>

<script>
export default {
  props: {
    wide: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isWide() {
      return this.wide
    },
  },
  methods: {
    cancel() {
      console.log('clicked cancel')
    },
  },
}
</script>

<style>
.measure-aside {
  width: var(--width-medium);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--background-color);
}

/* acts as a spacer to push down the footer */
.measure-aside:after {
  content: '';
  display: block;
  width: 100%;
  flex-grow: 2;
  order: 4;
}

.measure-aside__wide {
  width: 100%;
  min-width: 400px;
  max-width: calc(100vw - var(--width-large));
}

.measure-aside__footer {
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: var(--spacing-default);
  order: 5;

  text-align: right;
  background-color: var(--background-color);
  box-shadow: var(--shadow-small-grey);
}

.measure-aside__btn-cancel {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
