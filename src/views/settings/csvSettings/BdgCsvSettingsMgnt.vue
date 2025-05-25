<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1>CSV Settings Management</h1>
            </v-col>
        </v-row>

        <!-- List of Settings -->
        <v-row>
            <v-col cols="12">
                <v-data-table
                    :items="settings"
                    :headers="headers"
                    item-value="name"
                    class="elevation-1"
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Settings</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" :to="{ path: '/settings/csvsettings/new' }"
                                >Add Setting
                            </v-btn>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            icon="mdi-pencil"
                            variant="text"
                            density="comfortable"
                            size="small"
                            :to="{ path: `/settings/csvsettings/edit/${item.id}` }"
                            title="Edit"
                        ></v-btn>
                        <v-btn
                            icon="mdi-delete"
                            variant="text"
                            density="comfortable"
                            size="small"
                            class="ml-2"
                            color="error"
                            @click="confirmDelete(item)"
                            title="Delete"
                        ></v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6">Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete the setting "{{ settingToDelete?.name }}"? This
                    action cannot be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="cancelDelete">Cancel</v-btn>
                    <v-btn color="error" @click="deleteSetting">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useCsvSettingsStore } from '@/stores/csvSettings-store'
    import type { CSVSettings } from '@models/csvDocument'

    const csvSettingsStore = useCsvSettingsStore()
    const settings = computed(() => csvSettingsStore.settings)

    // Dialog state variables
    const showDeleteDialog = ref(false)
    const settingToDelete = ref<CSVSettings | null>(null)

    const headers = [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
    ]

    function confirmDelete(item: CSVSettings) {
        settingToDelete.value = item
        showDeleteDialog.value = true
    }

    function deleteSetting() {
        if (settingToDelete.value) {
            csvSettingsStore.removeSetting(settingToDelete.value.id)
            showDeleteDialog.value = false
            settingToDelete.value = null
        }
    }

    function cancelDelete() {
        showDeleteDialog.value = false
        settingToDelete.value = null
    }
</script>

<style scoped>
    .v-data-table {
        margin-top: 20px;
    }
</style>
