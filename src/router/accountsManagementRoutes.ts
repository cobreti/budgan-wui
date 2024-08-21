
export const accountsManagementRoutes = [
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@views/accountsManagement/manage-accounts.vue'),
    meta: { transition: 'slide-right' }
  },
  {
    path: '/accounts/new',
    name: 'newAccount',
    component: () => import('@views/accountsManagement/new-account.vue'),
  }
]
