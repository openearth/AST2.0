<template>
  <div class="hint-text">
    <md-icon v-if="icon" class="hint-text__icon">{{ icon }}</md-icon>
    <span class="md-caption">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
      default: '',
    },
    text: {
      type: String,
      required: true,
    },
  },
}
</script>

<style>
.hint-text {
  white-space: normal;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hint-text__icon {
  margin-right: var(--spacing-default);
}
</style>
