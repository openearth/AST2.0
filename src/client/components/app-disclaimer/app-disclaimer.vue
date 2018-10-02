<template>
  <div class="app-disclaimer">
    <div>
      <h1>Disclaimer content</h1>
      <md-button
        class="md-raised md-primary"
        @click="$emit('accepted')">
        {{ $t('ok') }}
      </md-button>
    </div>
  </div>
</template>

<style>
.app-disclaimer {
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
