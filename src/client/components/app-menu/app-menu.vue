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
            :to="`/${$i18n.locale}/new-project/`"
            :disabled="!acceptedLegal"
            class="app-menu__button">
            <md-icon>add</md-icon>
            <span class="md-body-1">
              {{ $t('new_project') }}
            </span>
          </md-button>
        </md-list-item>

        <md-list-item class="app-menu__open-folder">
          <md-button
            :to="`/${$i18n.locale}/`"
            :disabled="!acceptedLegal"
            class="app-menu__button app-menu__open-folder-button">
            <md-icon>folder_open</md-icon>
            <span class="md-body-1">
              {{ $t('open_project') }}
            </span>
          </md-button>
          <input
            v-if="acceptedLegal"
            class="app-menu__input-file"
            type="file"
            accept="application/json"
            @change="event => $emit('importProject', event)">
        </md-list-item>
        <md-divider />

        <md-list-item>
          <md-button
            :to="`/${$i18n.locale}/settings/project-area/`"
            :disabled="!createdProjectArea"
            class="app-menu__button">
            <md-icon>settings</md-icon>
            <span class="md-body-1">
              {{ $t('project_settings') }}
            </span>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-button
            :disabled="!createdProjectArea"
            class="app-menu__button"
            @click="$emit('saveProject')">
            <md-icon>save</md-icon>
            <span class="md-body-1">
              {{ $t('save_project') }}
            </span>
          </md-button>
        </md-list-item>

        <md-list-item>
          <md-button
            :to="`/${$i18n.locale}/`"
            :disabled="!filledInRequiredSettings"
            class="app-menu__button">
            <md-icon>publish</md-icon>
            <span class="md-body-1">
              {{ $t('export_project') }}
            </span>
          </md-button>
        </md-list-item>
        <md-divider />

        <md-list-item>
          <nuxt-link
            :to="`/${$i18n.locale}/legal/`"
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
      acceptedLegal: {
        type: Boolean,
        required: true,
        default: false,
      },
      createdProjectArea: {
        type: Boolean,
        required: true,
        default: false,
      },
      filledInRequiredSettings: {
        type: Boolean,
        required: true,
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

  .app-menu__button .md-button-content {
    flex-grow: 1;
    text-align: left;
  }

  .app-menu .md-list-item-content {
    padding-left: 0;
  }

  .app-menu .app-menu__button.md-button {
    text-transform: none;
  }

  .app-menu .app-menu__button .md-icon {
    margin-right: var(--spacing-default);
  }

  .app-menu .md-button::before {
    display: none;
  }

  .app-menu__link {
    padding: 0 var(--spacing-default);
    color: var(--text-color) !important; /* override vue-material link color */
  }

  .app-menu__open-folder {
    z-index: 0;
  }

  .app-menu__open-folder-button {
    z-index: 0;
  }

  .app-menu__input-file {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    opacity: 0;
    z-index: 1;
  }

  .app-menu__input-file:hover {
    cursor: pointer;
  }
</style>
