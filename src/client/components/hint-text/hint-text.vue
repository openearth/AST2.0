<template>
  <div class="hint-text">
    <md-icon v-if="icon" class="hint-text__icon">{{ icon }}</md-icon>
    <p class="md-subheading hint-text__text">{{ text }}</p>
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
  align-items: flex-start;
}

.md-icon.hint-text__icon {
  margin-top: 5px;
  margin-right: var(--spacing-default);
  font-size: 30px !important;
  color: var(--md-theme-default-primary, #008fc5) !important;
}

.hint-text__text {
  /* margin-top: 10px; */
}

</style>
