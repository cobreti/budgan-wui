import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type WorkspaceStore = {
    handle: Ref<FileSystemHandle | null>
    path: Ref<string | null>
    setHandle: (handle: FileSystemHandle | null, path?: string | null) => void
}

export const useWorkspaceStore = defineStore<string, WorkspaceStore>(
    'workspace',
    () => {
        const handle = ref<FileSystemHandle | null>(null)
        const path = ref<string | null>(null)

        function setHandle(newHandle: FileSystemHandle | null, newPath: string | null = null) {
            handle.value = newHandle
            path.value = newPath || (newHandle ? newHandle.name : null)
        }

        return {
            handle,
            path,
            setHandle
        }
    }
)
