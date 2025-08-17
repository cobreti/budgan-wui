<template>
    <div class="settings-page">
        <v-toolbar flat class="settings-toolbar" color="primary" dark>
            <v-toolbar-title>Settings</v-toolbar-title>
        </v-toolbar>
        <v-container class="settings-container">
            <v-row>
                <v-col cols="12">
                    <v-list nav>
                        <v-list-item
                            v-for="item in subPages"
                            :key="item.key"
                            :title="item.title"
                            :prepend-icon="item.icon"
                            @click="goToSubPage(item)"
                        />
                    </v-list>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
    .settings-page {
        display: flex;
        flex-direction: column;
        min-height: calc(100vh - 64px); /* Subtract app bar height */
        max-width: 1000px;
        margin: 0 auto;
    }

    .settings-toolbar {
        background: var(--v-theme-primary);
        color: #fff;
        box-shadow: none;
        padding-left: 0;
    }

    .settings-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
        flex: 1;
    }
</style>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const subPages = [
    { key: 'workspace', title: 'Workspace Settings', icon: 'mdi-earth', route: '/settings/workspace' },
    { key: 'csv', title: 'CSV Settings', icon: 'mdi-file-delimited', route: '/settings/csv' }
]

function goToSubPage(item: { key: string; route: string }) {
    if (route.path !== item.route) {
        router.push(item.route)
    }
}
</script>
