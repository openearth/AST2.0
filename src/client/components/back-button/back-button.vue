<template>
  <component :is="comp" class="back-button__container">
    <section class="back-button__inner">
      <md-button class="back-button__btn" @click="$router.back()">
        <md-icon>keyboard_arrow_left</md-icon>
        {{ $t('back') }}
      </md-button>
    </section>
    <section class="back-button__slot">
      <slot />
    </section>
  </component>
</template>

<script>
export default {
  props: {
    comp: {
      type: String,
      default: "header",
    },
  },
}
</script>

<style>
.back-button__container {
  display: flex;
  justify-content: space-between;
}

.back-button__inner {
  margin-right: 15px;
  text-align: left;
}

.back-button__btn {
  position: relative;
  left: -23px;
}

.back-button__slot {
  text-align: right;
}

</style>
