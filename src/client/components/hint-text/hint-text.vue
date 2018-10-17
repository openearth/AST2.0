<template>
  <div class="hint-text">
    <md-icon>{{ icon }}</md-icon>
    <span class="md-body-2 hint-text__content">{{ $t(translation) }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    translation: {
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
  align-items: baseline;
}

.hint-text__content {
  padding: var(--spacing-default);
}
</style>
