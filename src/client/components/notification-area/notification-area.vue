<template>
  <div>
    <md-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      :md-duration="Infinity"
      :md-active="true"
      md-position="center"
      md-persistent
    >
      <span>
        <md-icon
          v-if="notification.type === 'warning'"
          class="md-accent"
          style="color: #FFEB3B;"
        >warning</md-icon>
        <md-icon
          v-if="notification.type === 'error'"
          class="md-accent"
          style="color: #F44336;"
        >error</md-icon>
        {{ notification.message }}
      </span>
      <md-button
        v-if="notification.closable"
        class="md-accent"
        @click="$emit('remove-notification', notification.id)"
      >
        Close
      </md-button>
    </md-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    notifications: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
