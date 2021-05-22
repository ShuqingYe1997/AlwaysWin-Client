import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const default_portrait = 'https://alwayswin-figures.s3.amazonaws.com/icon/default-icon.png'

const state = {
  token: getToken(),
  uid: '',
  username: '',
  portrait: default_portrait,
  roles: ['visitor']
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_PORTRAIT: (state, portrait) => {
    state.portrait = portrait
  },
  SET_ROLES: (state, role) => {
    state.roles = [role] // roles must be a non-empty array
  }
}

const actions = {
  // user login
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      login(loginForm).then(response => {
        const { data } = response

        commit('SET_TOKEN', data.token)
        commit('SET_USERNAME', data.username)
        commit('SET_ROLES', data.role)
        commit('SET_UID', data.uid)
        commit('SET_PORTRAIT', data.portrait)

        setToken(data.token) // 登录成功后将token存储在cookie之中

        console.log('username ' + state.username)
        console.log('roles ' + state.roles)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_PORTRAIT', default_portrait)
        commit('SET_USERNAME', '')
        commit('SET_TOKEN', '')
        commit('SET_UID', '')
        commit('SET_ROLES', 'visitor')
        removeToken()
        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = dispatch('permission/generateRoutes', state.roles, { root: true })
        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', 'visitor')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
