<template>
  <portal to="popup-portal">
    <article class="app-popup">
      <span class="app-popup__hitarea" @click="closeHandler"/>
      <div class="app-popup__inner">
        <header class="app-popup__header">
          <h3 class="md-headline app-popup__title">{{ title }}</h3>
          <md-button class="md-icon-button app-popup__close-button" @click="closeHandler">
            <md-icon>close</md-icon>
          </md-button>
        </header>
        <slot />
      </div>
    </article>
  </portal>
</template>


<script>
export default {
  props: {
      title: {
          type: String,
          default: "Results",
      },
  },
  methods: {
    closeHandler() {
      this.$emit('closePopup');
    },
  },
}
</script>

<style>
.app-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  z-index: var(--layer--popup);
}

/*======================= overlay */
.app-popup__hitarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: black;
  opacity: 0.2;
  z-index: 1;
}

/*======================= centered */
.app-popup__inner {
  position: relative;
  z-index: 2;
  width: calc(100% - (var(--spacing-double) * 2) );
  max-width: 1400px;
  max-height: calc(100% - (var(--spacing-double) * 2));
  overflow: auto;
  margin: auto;

  background-color: var(--background-color);
}

/*======================= header */
.app-popup__header {
  display: flex;
  align-items: center;
  padding-top: var(--spacing-half);
  padding-bottom: var(--spacing-half);
  padding-left: var(--spacing-default);
  background-color: var(--action-color);
}

.app-popup__title {
  flex-grow: 2;
  color: var(--background-color);
}

.app-popup__close-button {
  min-width: 40px;
  min-height: 40px;
}

.app-popup__close-button i {
  color: white !important;
}

/*======================= content */
.app-popup__content {
  padding: 10px 20px;
}


</style>
