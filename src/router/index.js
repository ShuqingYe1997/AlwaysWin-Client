import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['visitor','user']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: 'Dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: 'AllProducts',
    children: [
      {
        path: '/product',
        component: () => import('@/views/all-product/index'),
        name: 'AllProducts',
        meta: {
          title: 'Products',
          icon: 'component'
        }
      },
      {
        path: '/product/:pid(\\d+)',
        component: () => import('@/views/product/index'),
        name: 'ProductPage',
        hidden: true,
        meta: { title: 'Product details', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/user',
    component: Layout,
    redirect: '/profile',
    meta: {
      title: 'User Center',
      icon: 'user',
      roles: ['user']

    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/user-profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'edit' }
      },
      {
        path: 'address',
        component: () => import('@/views/address/index'),
        name: 'Address',
        meta: { title: 'Address', icon: 'el-icon-truck' }
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    meta: {
      title: 'My Purchase',
      icon: 'shopping',
      roles: ['user']
    },
    children: [
      {
        path: 'my-order',
        component: () => import('@/views/order/myBuying'),
        name: 'BuyingOrder',
        meta: { title: 'My Order', icon: 'clipboard' }
      },
      {
        path: 'my-bid',
        component: () => import('@/views/bid/index'),
        name: 'BidHisrory',
        meta: { title: 'My bid', icon: 'money' }
      }
    ]
  },
  {
    path: '/sell',
    component: Layout,
    meta: {
      title: 'Seller Hub',
      icon: 'el-icon-sell',
      roles: ['user']
    },
    children: [
      {
        path: 'my-selling-order',
        component: () => import('@/views/order/mySelling'),
        name: 'SellingOrder',
        meta: { title: 'My Sold', icon: 'el-icon-s-finance' }
      },
      {
        path: 'my-product',
        component: () => import('@/views/my-product/index'),
        name: 'MyProduct',
        meta: { title: 'My Product', icon: 'el-icon-s-goods' }
      },
      {
        path: 'update-product',
        component: () => import('@/views/my-product/new/index'),
        name: 'UpdateProduct',
        hidden: true
      },
      {
        path: 'create-product',
        component: () => import('@/views/my-product/new/index'),
        name: 'CreateProduct',
        meta: { title: 'Create Product', icon: 'el-icon-circle-plus' }
      }
    ]
  },
  {
    path: '/wishlist',
    component: Layout,
    redirect: 'Wishlist',
    children: [
      {
        path: '/my-wish-list',
        component: () => import('@/views/wishList/index'),
        name: 'Wishlist',
        meta: {
          title: 'Wish List',
          icon: 'el-icon-star-on',
          roles: ['user']
        }
      }
    ]
  },

  // ?????????????????????401,???????????????404
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
