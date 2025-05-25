export const accountRoutes = [
    {
        path: '/account/:id/transactions',
        name: 'account-transactions',
        component: () => import('@views/account/BdgAccountTransactions.vue')
    },
    {
        path: '/account/:id/monthly-transactions',
        name: 'account-monthly-transactions',
        component: () => import('@views/account/BdgMonthlyTransactions.vue')
    },
    {
        path: '/account/:id/add-statement',
        name: 'account-add-statement',
        component: () => import('@views/account/BdgAddStatement.vue')
    }
]
