import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// todo: more urls in white list
// no redirect whitelist
const whiteList = ['/', 'dashboard', '/login', '/register', '/product', '/product/*']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const roles = store.getters.roles
  console.log('roles: ' + roles)

  // if roles doesn't contain 'user'
  if (roles.indexOf('user') === -1) {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // next({ path: '/401' })
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  } else { // if roles contains 'user'
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    }
  }

  next()
  // generate accessible routes map based on roles
  const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
  // dynamically add accessible routes
  router.addRoutes(accessRoutes)

  // hack method to ensure that addRoutes is complete
  // set the replace: true, so the navigation will not leave a history record
  next({ ...to, replace: true })
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
