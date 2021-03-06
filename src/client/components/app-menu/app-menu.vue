<template>
  <aside class="app-menu">
    <md-drawer :md-active="showNavigation">
      <md-toolbar class="md-transparent app-menu__header" md-elevation="0">
        <h3
          class="md-body-2"
          role="heading"
          aria-level="2"
        >
          {{ title }}
        </h3>

        <md-button class="md-icon-button" @click="$emit('on-close-navigation')">
          <md-icon>clear</md-icon>
        </md-button>
      </md-toolbar>
      <md-divider />

      <nav>
        <md-list>
          <md-list-item>
            <md-button
              :disabled="!acceptedLegal"
              class="app-menu__button"
              @click="$emit('new-project')"
            >
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
              class="app-menu__button app-menu__open-folder-button"
            >
              <md-icon>folder_open</md-icon>
              <span class="md-body-1">
                {{ $t('open_project') }}
              </span>
            </md-button>
            <!-- this input element is being references by its id in default.vue -->
            <input
              v-if="acceptedLegal"
              id="open-project"
              class="app-menu__input-file"
              type="file"
              accept="application/json"
              @change="event => $emit('import-project', event)"
            >
          </md-list-item>
          <md-divider />

          <md-list-item>
            <md-button
              :to="`/${$i18n.locale}/settings/project-area/`"
              :disabled="!createdProjectArea"
              class="app-menu__button"
            >
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
              @click="$emit('save-project')"
            >
              <md-icon>save</md-icon>
              <span class="md-body-1">
                {{ $t('save_project') }}
              </span>
            </md-button>
          </md-list-item>

          <md-list-item>
            <md-button
              id="export-project"
              :disabled="!hasAreas"
              class="app-menu__button"
              @click="$emit('export-project')"
            >
              <md-icon>publish</md-icon>
              <span class="md-body-1">
                {{ $t('export_project') }}
              </span>
            </md-button>
          </md-list-item>
          <md-divider />

          <md-list-item>
            <md-button
              :to="`/${$i18n.locale}/about/`"
              class="app-menu__button"
            >
              <md-icon>info</md-icon>
              <span class="md-body-1">
                {{ $t('about') }}
              </span>
            </md-button>
          </md-list-item>

          <md-list-item>
            <md-button
              :to="`/${$i18n.locale}/documentation/`"
              class="app-menu__button"
            >
              <md-icon>help</md-icon>
              <span class="md-body-1">
                {{ $t('documentation') }}
              </span>
            </md-button>
          </md-list-item>

          <md-list-item>
            <md-button
              :to="`/${$i18n.locale}/legal/`"
              class="app-menu__button"
            >
              <md-icon>list_alt</md-icon>
              <span class="md-body-1">
                {{ $t('legal') }}
              </span>
            </md-button>
          </md-list-item>
        </md-list>
      </nav>
    </md-drawer>
  </aside>
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
      hasAreas: {
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
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }

  .app-menu__input-file:hover {
    cursor: pointer;
  }
</style>
