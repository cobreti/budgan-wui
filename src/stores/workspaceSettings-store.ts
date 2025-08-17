import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { WorkspaceSettings } from '@/core/models/WorkspaceSettings'

export type WorkspaceSettingsStore = {
    workspaceSettings: Ref<WorkspaceSettings>
    setFilePath: (filePath: string) => void
    clearFilePath: () => void
    updateSettings: (settings: Partial<WorkspaceSettings>) => void
}

export const useWorkspaceSettingsStore = defineStore<string, WorkspaceSettingsStore>(
    'workspaceSettings',
    () => {
        const workspaceSettings = ref<WorkspaceSettings>({
            FilePath: undefined
        })

        function setFilePath(filePath: string) {
            workspaceSettings.value = {
                ...workspaceSettings.value,
                FilePath: filePath
            }
        }

        function clearFilePath() {
            workspaceSettings.value = {
                ...workspaceSettings.value,
                FilePath: undefined
            }
        }

        function updateSettings(settings: Partial<WorkspaceSettings>) {
            workspaceSettings.value = {
                ...workspaceSettings.value,
                ...settings
            }
        }

        return {
            workspaceSettings,
            setFilePath,
            clearFilePath,
            updateSettings
        }
    },
    {
        persist: {
            storage: localStorage
        }
    }
)
