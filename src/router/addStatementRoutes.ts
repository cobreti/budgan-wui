import { useAddStatementStore } from '@/stores/add-statement-store'

export const addStatementRoutes = [
  {
    path: '/add-statement',
    name: 'addStatement',
    component: () => import('@views/addStatement/AddStatement.vue'),
    meta: { transition: 'slide-right' }
  },
  {
    path: '/add-statement/:id',
    name: 'addStatementAccountTransactions',
    component: () => import('@views/addStatement/AccountTransactions.vue'),
    meta: { transition: 'slide-right' },
    beforeEnter: (to: any, from: any, next: () => void) => {

      const addStatementStore = useAddStatementStore();
      const id = to.params.id as string;

      if (addStatementStore.accountExists(id)) {
        next();
      }

      console.error(`${id} not found in accounts`);
    }
  }
]
