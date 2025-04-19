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
                            <v-btn color="primary" @click="newSettings()">Add Setting</v-btn>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn icon @click="editSettings(item)">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteSetting(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>

        <!-- Dialog for Add/Update -->
        <!-- <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="text-h5">{{ dialogItem ? 'Edit Setting' : 'Add Setting' }}</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        v-model="dialogItem.name"
                        label="Setting Name"
                        outlined
                        dense
                        clearable
                    />
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="closeDialog">Cancel</v-btn>
                    <v-btn text color="primary" @click="saveSetting">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
    </v-container>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import { useCsvSettingsStore } from '@/stores/csvSettings-store'
    import type { CSVSettings } from '@models/csvDocument'

    const csvSettingsStore = useCsvSettingsStore()

    const settings = computed(() => csvSettingsStore.settings)

    const headers = [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'actions', sortable: false }
    ]

    // const dialog = ref(false)
    // const dialogItem = ref(null)

    // function openDialog(item: CSVSettings) {
    //     dialogItem.value = item ? { ...item } : { name: '' }
    //     dialog.value = true
    // }

    // function closeDialog() {
    //     dialog.value = false
    //     dialogItem.value = null
    // }

    // function saveSetting() {
    //     if (dialogItem.value) {
    //         if (dialogItem.value.id) {
    //             csvSettingsStore.updateSetting(dialogItem.value)
    //         } else {
    //             csvSettingsStore.addSetting(dialogItem.value)
    //         }
    //     }
    //     closeDialog()
    // }

    function newSettings() {}

    function editSettings(item: CSVSettings) {}

    function deleteSetting(item: CSVSettings) {
        csvSettingsStore.removeSetting(item.id)
    }
</script>

<style scoped>
    .v-data-table {
        margin-top: 20px;
    }
</style>
