<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  props: {
    isBelowThreshold: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      notificationId: undefined,
    }
  },
  watch: {
    isBelowThreshold(belowThreshold) {
      if (belowThreshold) {
        if (this.notificationId) {
          this.notificationId = undefined
          this.removeError(this.notificationId)
        }
      } else {
        if (this.notificationId === undefined) {
          this.notificationId = this.showError({ message: this.$i18n.t('project_area_to_large'), closable: false, duration: 0 })
        }
      }
    },
  },
  methods: {
    ...mapActions({
      showError: 'notifications/showError',
    }),
    ...mapMutations({
      removeError: 'notifications/remove',
    }),
  },
  render() {
    return null
  },
}
</script>
