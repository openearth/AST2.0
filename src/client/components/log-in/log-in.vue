<template>
  <md-button class="md-primary md-icon-button" @click="handleClick">
    <md-icon v-if="isLoggedIn">
      person
    </md-icon>
    <md-icon v-else>
      person_outline
    </md-icon>
    <md-tooltip md-direction="bottom">
      <template v-if="isLoggedIn">
        {{ $t('logout') }}
      </template>
      <template v-else>
        {{ $t('login') }}
      </template>
    </md-tooltip>
  </md-button>
</template>

<script>
import netlifyIdentity from 'netlify-identity-widget'
import { mapGetters, mapMutations } from 'vuex';
import delay from '../../lib/delay'

export default {
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
  },
  methods: {
    handleClick() {
      if (this.isLoggedIn) {
        netlifyIdentity.logout()
      } else {
        netlifyIdentity.open('login')
        netlifyIdentity.on('login', async () => {
          this.isRefreshing()
          await delay(10)
          window.location.reload()
        })
      }
    },
    ...mapMutations({
      isRefreshing: 'user/isRefreshing',
    }),
  },
}
</script>
