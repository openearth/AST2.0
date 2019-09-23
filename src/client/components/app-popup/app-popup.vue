<template>
  <portal to="popup-portal">
    <article class="app-popup">
      <span class="app-popup__hitarea"/>
      <div class="app-popup__inner">
        <header>
          I'm the popup header
        </header>
        <section>
          I'm the popup content
        </section>
      </div>
    </article>
  </portal>
</template>


<script>
export default {

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

.app-popup__header {
  padding: 10px 20px;
}

.app-popup__content {
  padding: 10px 20px;
}

</style>
