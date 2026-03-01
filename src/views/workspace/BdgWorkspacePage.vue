<template>
    <main>
        <v-container class="workspace-container">
            <v-row>
                <v-col cols="12">
                    <h1 class="h1-header">Workspace Management</h1>
                </v-col>
            </v-row>

            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card variant="outlined" class="pa-4">
                        <v-card-title>Current Workspace</v-card-title>
                        <v-card-text>
                            <div v-if="workspaceStore.workspace" class="d-flex align-center">
                                <v-icon
                                    :icon="workspaceStore.workspace.handle.kind === 'directory' ? 'mdi-folder' : 'mdi-file'"
                                    class="mr-2"
                                    color="primary"
                                ></v-icon>
                                <span class="text-h6">{{ workspaceStore.workspace.filename || workspaceStore.workspace.handle.name }}</span>
                            </div>
                            <div v-else>
                                <v-alert type="info" variant="tonal">
                                    No workspace selected. Please select a file or create a new one.
                                </v-alert>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                v-if="workspaceStore.workspace"
                                color="error"
                                variant="text"
                                @click="clearWorkspace"
                            >
                                Clear Workspace
                            </v-btn>
                            <v-btn color="secondary" variant="outlined" class="mr-2" @click="createWorkspace">
                                Create New Workspace
                            </v-btn>
                            <v-btn color="primary" variant="outlined" @click="selectWorkspace">
                                Select Workspace
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<script setup lang="ts">
    import { useWorkspaceStore } from '@/stores/workspace-store'
    import { container } from '@/core/setupInversify'
    import { ServicesTypes } from '@/core/services/types'
    import type { WorkspaceFactory } from '@/core/services/WorkspaceFactory'

    const workspaceStore = useWorkspaceStore()
    const workspaceFactory = container.get<WorkspaceFactory>(ServicesTypes.WorkspaceFactory)

    async function selectWorkspace() {
        try {
            const [handle] = await (window as any).showOpenFilePicker({
                types: [
                    {
                        description: 'Budgan Workspace File',
                        accept: {
                            'application/octet-stream': ['.bdg']
                        }
                    }
                ]
            })
            updateStoreWithHandle(handle)
        } catch (error) {
            handleError(error, 'Failed to select workspace')
        }
    }

    async function createWorkspace() {
        try {
            const handle = await (window as any).showSaveFilePicker({
                types: [
                    {
                        description: 'Budgan Workspace File',
                        accept: {
                            'application/octet-stream': ['.bdg']
                        }
                    }
                ]
            })
            updateStoreWithHandle(handle)
        } catch (error) {
            handleError(error, 'Failed to create workspace')
        }
    }

    function updateStoreWithHandle(handle: FileSystemFileHandle) {
        const workspace = workspaceFactory.create(handle)
        workspaceStore.setWorkspace(workspace)
    }

    function handleError(error: unknown, message: string) {
        if ((error as Error).name === 'AbortError') {
            return
        }
        console.error(message + ':', error)
    }

    function clearWorkspace() {
        workspaceStore.setWorkspace(null)
    }
</script>

<style scoped>
    .workspace-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .h1-header {
        color: #4a4a4a;
        text-align: center;
        margin-bottom: 1rem;
    }
</style>
