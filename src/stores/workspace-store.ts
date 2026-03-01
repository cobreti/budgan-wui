import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { Workspace } from '@/core/modules/Workspace/Workspace'

export type WorkspaceStore = {
    workspace: Ref<Workspace | null>
    setWorkspace: (workspace: Workspace | null) => void
}

export const useWorkspaceStore = defineStore<string, WorkspaceStore>(
    'workspace',
    () => {
        const workspace = ref<Workspace | null>(null)

        function setWorkspace(newWorkspace: Workspace | null) {
            workspace.value = newWorkspace
        }

        return {
            workspace,
            setWorkspace
        }
    }
)
