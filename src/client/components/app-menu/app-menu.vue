<template>
  <div class="app-menu">
    <md-drawer :md-active="showNavigation">
      <md-toolbar class="md-transparent app-menu__header" md-elevation="0">
        <span v-if="title" class="md-body-2">{{ title }}</span>

        <md-button class="md-icon-button" @click="() => $emit('onCloseNavigation')">
          <md-icon>clear</md-icon>
        </md-button>
      </md-toolbar>
      <md-divider />

      <md-list>
        <md-list-item>
          <md-button
            :href="`/${$i18n.locale}/settings/general`"
            :disabled="isProject"
            class="app-menu__button">
            <md-icon>settings</md-icon>
            <span class="md-body-1">
              {{ $t('project_settings') }}
            </span>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-button
            :href="`/${$i18n.locale}/settings/general`"
            :disabled="isProject"
            class="app-menu__button">
            <md-icon>save</md-icon>
            <span class="md-body-1">
              {{ $t('save_project') }}
            </span>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-button
            :href="`/${$i18n.locale}/settings/general`"
            :disabled="isProject"
            class="app-menu__button">
            <md-icon>publish</md-icon>
            <span class="md-body-1">
              {{ $t('export_project') }}
            </span>
          </md-button>
        </md-list-item>
        <md-divider />

        <md-list-item>
          <md-button
            :href="`/${$i18n.locale}/`"
            :disabled="isProject"
            class="app-menu__button">
            <md-icon>folder_open</md-icon>
            <span class="md-body-1">
              {{ $t('open_project') }}
            </span>
          </md-button>
        </md-list-item>
        <md-divider />

        <md-list-item>
          <nuxt-link
            :to="`/${$i18n.locale}/`"
            class="app-menu__link md-list-item-text">{{ $t('legal') }}</nuxt-link>
        </md-list-item>
        <md-list-item>
          <nuxt-link
            :to="`/${$i18n.locale}/documentation`"
            class="app-menu__link md-list-item-text">{{ $t('documentation') }}</nuxt-link>
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
      isProject: {
        type: Boolean,
        default: false,
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

  .app-menu__button {
    flex-grow: 1;
  }

  .app-menu__button .md-ripple {
    padding: 0;
  }

  .app-menu__button .md-button-content {
    flex-grow: 1;
  }

  .app-menu .md-list-item-content {
    padding: 0 0;
  }

  .app-menu .app-menu__button.md-button {
    text-transform: none;
    margin: 0 0;
    padding: var(--spacing-half) var(--spacing-default);
    height: 100%;
  }

  .app-menu .app-menu__button .md-icon {
    margin-right: var(--spacing-default);
  }

  .app-menu .md-button::before {
    display: none;
  }

  .app-menu__link {
    padding: var(--spacing-half) var(--spacing-default);
  }
</style>