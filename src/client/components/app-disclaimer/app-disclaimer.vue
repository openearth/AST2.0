<template>
  <div class="app-disclaimer">
    <div class="app-disclaimer__content">
      <h1 class="title">{{ disclaimer.title }}</h1>
      <p class="md-body-1 app-disclaimer__body">{{ disclaimer.content }}</p>
      <span class="md-body-1 app-disclaimer__footer">{{ disclaimer.footer }}</span>
      <md-button
        class="md-raised md-primary app-disclaimer__button"
        @click="$emit('accepted')">
        {{ $t('ok') }}
      </md-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disclaimer: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
}
</script>


<style>
.app-disclaimer {
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.app-disclaimer__content {
  padding: var(--spacing-default) var(--spacing-double);
  background-color: var(--text-color);
  color: #fff;
  width: 100%;
}

.app-disclaimer__body {
  margin-bottom: var(--spacing-double);
}

.app-disclaimer__button {
  display: block;
  margin-left: auto;
  margin-top: auto;
}

.app-disclaimer__footer {
  font-size: 12px;
}
</style>
