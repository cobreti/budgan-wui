
export const manageAccountsRoutes = [
  {
    path: '/accounts',
    name: 'addStatement',
    component: () => import('@views/accounts/manage-accounts.vue'),
    meta: { transition: 'slide-right' }
  },
  {
    path: '/accounts/new',
    name: 'newAccount',
    component: () => import('@views/accounts/new-account.vue'),
  }
]
