import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// todo: more urls in white list
// no redirect whitelist
// const whiteList = ['/', '/login', '/register', '/auth-redirect']

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const roles = store.getters.roles

  // if roles contains 'user'
  if (roles.indexOf('user') !== -1) {
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
  // next({ ...to, replace: true })
  next({ ...to, replace: true })
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
