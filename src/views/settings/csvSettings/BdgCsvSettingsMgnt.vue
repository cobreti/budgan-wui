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
                        <v-btn icon :to="{ path: `/settings/csvsettings/edit/${item.id}` }">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteSetting(item)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>
            </v-col>
        </v-row>
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
