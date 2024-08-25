import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/BdgHomeView.vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { addStatementRoutes } from '@/router/addStatementRoutes'
import { accountsManagementRoutes } from '@/router/accountsManagementRoutes'
import { accountRoutes } from '@/router/accountRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...addStatementRoutes,
    ...accountsManagementRoutes,
    ...accountRoutes,
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@views/BdgAboutView.vue')
    },
    {
      path: '/save',
      name: 'save',
      component: () => import('@views/BdgExportAccountData.vue'),
      beforeEnter: (to, from, next) => {
        const bankAccountsStore = useBankAccountsStore()

        if (bankAccountsStore.hasAccounts) {
          next()
        } else {
          next({ path: '/' })
        }
      }
    },
    {
      path: '/open',
      name: 'open',
      component: () => import('@views/BdgImportAccountData.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@views/settings/BdgSettingsPage.vue')
    }
  ]
})

export default router
