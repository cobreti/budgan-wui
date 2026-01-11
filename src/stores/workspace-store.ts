import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type WorkspaceStore = {
    handle: Ref<FileSystemDirectoryHandle | null>
    setHandle: (handle: FileSystemDirectoryHandle | null) => void
}

export const useWorkspaceStore = defineStore<string, WorkspaceStore>(
    'workspace',
    () => {
        const handle = ref<FileSystemDirectoryHandle | null>(null)

        function setHandle(newHandle: FileSystemDirectoryHandle | null) {
            handle.value = newHandle
        }

        return {
            handle,
            setHandle
        }
    }
)
