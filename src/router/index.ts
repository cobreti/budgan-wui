import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@views/BdgHomeView.vue'
import { accountsManagementRoutes } from '@/router/accountsManagementRoutes'
import { accountRoutes } from '@/router/accountRoutes'
import { settingsRoutes } from '@/router/settingsRoutes'
import { aiRoutes } from '@/router/aiRoutes'
import { setupRouteTracking } from '@/router/routeTracker'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        ...accountsManagementRoutes,
        ...accountRoutes,
        ...settingsRoutes,
        ...aiRoutes,
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
            path: '/account-data',
            name: 'accountData',
            component: () => import('@views/BdgAccountData.vue')
            // Component handles the tab display logic internally
        }
    ]
})

// Setup route tracking to determine navigation source
setupRouteTracking(router)

export default router
