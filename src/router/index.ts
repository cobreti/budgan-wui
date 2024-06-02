import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'
import { addStatementRoutes } from '@/router/addStatementRoutes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...addStatementRoutes,
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/account/:id',
      name: 'account',
      component: () => import('../views/AccountView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/save',
      name: 'save',
      component: () => import('../views/ExportAccountData.vue'),
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
      component: () => import('../views/ImportAccountData.vue')
    }
  ]
})

export default router
