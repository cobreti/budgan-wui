
export const accountsManagementRoutes = [
  {
    path: '/accounts',
    name: 'accounts',
    component: () => import('@views/accountsManagement/BdgManageAccounts.vue'),
    meta: { transition: 'slide-right' }
  },
  {
    path: '/accounts/new',
    name: 'newAccount',
    component: () => import('@views/accountsManagement/BdgNewAccount.vue'),
  }
]
