export const settingsRoutes = [
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@views/settings/BdgSettingsPage.vue')
    },
    {
        path: '/settings/workspace',
        name: 'settings-workspace',
        component: () => import('@views/settings/BdgWorkspaceSettings.vue')
    },
    {
        path: '/settings/csv',
        name: 'settings-csv',
        component: () => import('@views/settings/csvSettings/BdgCsvSettings.vue')
    },
    {
        path: '/settings/csvsettings/new',
        name: 'new-csv-settings',
        component: () => import('@views/settings/csvSettings/BdgCsvColumnsSettings.vue')
    },
    {
        path: '/settings/csvsettings/edit/:id',
        name: 'edit-csv-settings',
        component: () => import('@views/settings/csvSettings/BdgCsvColumnsSettings.vue')
    }
]
