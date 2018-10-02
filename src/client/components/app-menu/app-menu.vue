<template>
  <div class="app-menu">
    <md-drawer :md-active="showNavigation">
      <md-toolbar class="md-transparent app-menu__header" md-elevation="0">
        <span v-if="title" class="md-body-2">{{ title }}</span>

        <md-button class="md-icon-button app-menu__button" @click="() => $emit('onCloseNavigation')">
          <md-icon>clear</md-icon>
        </md-button>
      </md-toolbar>
      <md-divider />

      <md-list>
        <md-list-item>
          <md-icon>settings</md-icon>
          <span class="md-list-item-text">{{ $t('project_settings') }}</span>
        </md-list-item>

        <md-list-item>
          <md-icon>save</md-icon>
          <span class="md-list-item-text">{{ $t('save_project') }}</span>
        </md-list-item>

        <md-list-item>
          <md-icon>publish</md-icon>
          <span class="md-list-item-text">{{ $t('export_project') }}</span>
        </md-list-item>
        <md-divider />

        <md-list-item>
          <md-icon>folder_open</md-icon>
          <span class="md-list-item-text">{{ $t('open_project') }}</span>
        </md-list-item>
        <md-divider />

        <md-list-item>
          <nuxt-link :to="'/legal'" class="md-list-item-text">{{ $t('legal') }}</nuxt-link>
        </md-list-item>
        <md-list-item>
          <nuxt-link :to="'/docs'" class="md-list-item-text">{{ $t('documentation') }}</nuxt-link>
        </md-list-item>
      </md-list>

    </md-drawer>
  </div>
</template>

<script>
  export default {
    props: {
      showNavigation: {
        type: Boolean,
        required: true,
        default: false,
      },
      title: {
        type: String,
        required: false,
        default: '',
      },
    },
  }
</script>

<style>
  .app-menu .md-drawer {
    width: 280px;
    max-width: calc(100vw - 125px);
  }

  .app-menu__header {
    display: flex;
    justify-content: space-between;
  }
</style>