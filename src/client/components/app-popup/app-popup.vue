<template>
  <portal to="popup-portal">
    <article class="app-popup">
      <span class="app-popup__hitarea" @click="closeHandler"/>
      <div class="app-popup__inner">
        <header class="app-popup__header">
          <slot name="header" />
          <md-button class="md-icon-button app-popup__close-button" @click="closeHandler">
            <md-icon>close</md-icon>
          </md-button>
        </header>

        <section>
          <slot />
        </section>
      </div>
    </article>
  </portal>
</template>


<script>
export default {
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
  opacity: 0.1;
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
  position: relative;
  padding: 10px 20px;
}

.app-popup__close-button {
  position: absolute;
  top: 0;
  right: 0;
}

/*======================= content */
.app-popup__content {
  padding: 10px 20px;
}


</style>
