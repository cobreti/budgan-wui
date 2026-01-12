import { defineStore } from 'pinia'
import { computed, type ComputedRef, ref, type Ref } from 'vue'

export type AccountFileStore = {
    fileHandle: Ref<FileSystemFileHandle | null>
    fileName: ComputedRef<string | null>
    setFileHandle: (handle: FileSystemFileHandle | null) => void
}

export const useAccountFileStore = defineStore<string, AccountFileStore>(
    'accountFile',
    () => {
        const fileHandle = ref<FileSystemFileHandle | null>(null)

        const fileName = computed(() => {
            return fileHandle.value ? fileHandle.value.name : null
        })

        function setFileHandle(newHandle: FileSystemFileHandle | null) {
            fileHandle.value = newHandle
        }

        return {
            fileHandle,
            fileName,
            setFileHandle
        }
    }
)
