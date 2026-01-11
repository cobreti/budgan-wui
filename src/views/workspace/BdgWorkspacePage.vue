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
                            <div v-if="workspaceStore.handle" class="d-flex align-center">
                                <v-icon icon="mdi-folder" class="mr-2" color="primary"></v-icon>
                                <span class="text-h6">{{ workspaceStore.handle.name }}</span>
                            </div>
                            <div v-else>
                                <v-alert type="info" variant="tonal">
                                    No workspace selected. Please select a folder to start.
                                </v-alert>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                v-if="workspaceStore.handle"
                                color="error"
                                variant="text"
                                @click="clearWorkspace"
                            >
                                Clear Workspace
                            </v-btn>
                            <v-btn color="primary" @click="selectWorkspace">
                                {{ workspaceStore.handle ? 'Change Workspace' : 'Select Workspace' }}
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

    const workspaceStore = useWorkspaceStore()

    async function selectWorkspace() {
        try {
            const handle = await (window as any).showDirectoryPicker()
            workspaceStore.setHandle(handle)
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                return
            }
            console.error('Failed to select directory:', error)
        }
    }

    function clearWorkspace() {
        workspaceStore.setHandle(null)
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
