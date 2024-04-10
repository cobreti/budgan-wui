import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useBankAccountsStore } from '@/stores/bankAccounts-store'



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/add-statement',
      name: 'addStatement',
      component: () => import('../views/AddStatementView.vue'),
      meta: { transition: 'slide-right' }
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
      path: '/export',
      name: 'export',
      component: () => import('../views/ExportAccountData.vue'),
      beforeEnter: (to, from, next) => {

        const bankAccountsStore = useBankAccountsStore();

        if (bankAccountsStore.hasAccounts) {
          next();
        }
        else {
          next({path: '/'});
        }
      }
    }
  ]
})

export default router
