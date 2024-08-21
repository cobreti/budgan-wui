
export const accountRoutes = [
  {
    path: '/account/:id/transactions',
    name: 'account-transactions',
    component: () => import('@views/account/account-transactions.vue'),
  },
  {
    path: '/account/:id/add-statement',
    name: 'account-add-statement',
    component: () => import('@views/account/add-statement.vue'),
  }
]
