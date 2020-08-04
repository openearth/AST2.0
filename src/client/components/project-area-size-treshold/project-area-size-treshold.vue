<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  props: {
    isBelowTreshold: {
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
    isBelowTreshold(belowTreshold) {
      if (belowTreshold) {
        if (this.notificationId) {
          this.notificationId = undefined
          this.removeError(this.notificationId)
        }
      } else {
        if (this.notificationId === undefined) {
          this.notificationId = this.showError({ message: 'The project area is to large', closable: false, duration: 0 })
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
