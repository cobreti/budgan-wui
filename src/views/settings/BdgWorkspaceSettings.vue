<template>
  <div class="workspace-settings">
    <v-toolbar flat class="settings-toolbar" color="primary" dark>
      <div class="d-flex w-100 flex-row align-center justify-space-between">
        <div class="ml-4 d-flex flex-row align-center">
          <div class="back-button mr-2">
            <a @click="goBack" title="Back to Settings">
              <v-icon size="large" icon="mdi-chevron-left"></v-icon>
            </a>
          </div>
          <div class="header-title">
            <div>Workspace Settings</div>
          </div>
        </div>
      </div>
    </v-toolbar>
    <v-container class="settings-content">
      <v-card class="pa-4">
        <v-card-title class="text-h6 mb-4">
          Workspace Configuration
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4">
                <v-card-subtitle class="text-subtitle-1 font-weight-medium mb-3">
                  Workspace Folder
                </v-card-subtitle>
                <v-row align="center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="currentWorkspacePath"
                      label="Workspace Folder Path"
                      readonly
                      variant="outlined"
                      density="comfortable"
                      :placeholder="workspacePath || 'No workspace folder selected'"
                      prepend-inner-icon="mdi-folder"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="selectWorkspaceFolder"
                      prepend-icon="mdi-folder-open"
                      size="large"
                      block
                    >
                      Choose Workspace Folder
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-if="workspacePath" class="mt-2">
                  <v-col cols="12">
                    <v-btn
                      color="error"
                      variant="outlined"
                      @click="clearWorkspaceFolder"
                      prepend-icon="mdi-delete"
                      size="small"
                    >
                      Clear Workspace Folder
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useWorkspaceSettingsStore } from '@/stores/workspaceSettings-store'

const router = useRouter()
const workspaceStore = useWorkspaceSettingsStore()

// Computed property to get the current workspace path from store
const workspacePath = computed(() => workspaceStore.workspaceSettings.FilePath)

// Local reactive reference for the input field
const currentWorkspacePath = computed({
  get: () => workspacePath.value || '',
  set: (value: string) => {
    if (value) {
      workspaceStore.setFilePath(value)
    }
  }
})

function goBack() {
  router.push('/settings')
}

async function selectWorkspaceFolder() {
  try {
    // Check if the File System Access API is supported
    if ('showDirectoryPicker' in window) {
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'readwrite'
      })

      if (directoryHandle) {
        workspaceStore.setFilePath(directoryHandle.name)
      }
    } else {
      // Fallback for browsers that don't support the File System Access API
      const input = document.createElement('input')
      input.type = 'file'
      input.webkitdirectory = true
      input.multiple = true

      input.onchange = (event: Event) => {
        const target = event.target as HTMLInputElement
        if (target.files && target.files.length > 0) {
          const firstFile = target.files[0]
          const pathParts = firstFile.webkitRelativePath.split('/')
          if (pathParts.length > 0) {
            workspaceStore.setFilePath(pathParts[0])
          }
        }
      }

      input.click()
    }
  } catch (error) {
    console.error('Error selecting workspace folder:', error)
  }
}

function clearWorkspaceFolder() {
  workspaceStore.clearFilePath()
}
</script>

<style scoped>
.workspace-settings {
  max-width: 1000px;
  margin: 0 auto;
}

.settings-toolbar {
  background: var(--v-theme-primary);
  color: #fff;
  box-shadow: none;
  padding-left: 0;
}

.header-title {
  cursor: default;
  height: 100%;
  display: contents;
}

.header-title > div {
  font-weight: bold;
  align-content: center;
  margin-right: 1em;
}

.back-button {
  cursor: pointer;
}

.settings-content {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 2rem;
}
</style>
