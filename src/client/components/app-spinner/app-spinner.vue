<template>
  <div class="app-spinner">
    <md-progress-spinner
      :md-diameter="30"
      :md-stroke="3"
      md-mode="indeterminate"
    />
  </div>
</template>

<style>
.app-spinner {
  display: flex;
  justify-content: center;
}
</style>
