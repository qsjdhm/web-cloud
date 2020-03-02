/**
 * @module 车间看板
 * @author chebin
 */
const kanBanWorkShop = {
    path: '/kanBanWorkShop',
    component: () => import('@/layout/components/Lsd/lsd.vue'),
    redirect: '/kanBanWorkShop/list',
    name: 'kanBanWorkShop',
    meta: {
        title: 'kanBanWorkShop',
        icon: 'ic_kanban'
    },
    children: [
        {
            path:'list',
            component: () => import('@/views/kanBanWorkShop/list'),
            name: 'kanBanWorkShopList',
            meta: {
                title: 'kanBanWorkShop',
            }
        }
    ]
}
export default kanBanWorkShop