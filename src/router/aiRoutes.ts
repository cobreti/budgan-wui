import { type RouteRecordRaw } from 'vue-router'

export const aiRoutes: Array<RouteRecordRaw> = [
    {
        path: '/ai',
        name: 'ai',
        component: () => import('@views/ai/BdgAiView.vue')
    }
]
