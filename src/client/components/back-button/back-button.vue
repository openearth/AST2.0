<template>
  <header class="back-button__container">
    <md-button class="md-raised" @click="$router.go(-1)">
      <md-icon>keyboard_arrow_left</md-icon>
      {{ $t('back') }}
    </md-button>
  </header>
</template>

<style>
.back-button__container {
  text-align: right;
}
</style>
