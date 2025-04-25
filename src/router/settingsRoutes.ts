export const settingsRoutes = [
    {
        path: '/settings',
        name: 'settings',
        component: () => import('@views/settings/BdgSettingsPage.vue')
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
