const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  username: state => state.user.username,
  uid: state => state.user.uid,
  portrait: state => state.user.portrait,
  roles: state => [state.user.role],
  permission_routes: state => state.permission.routes
}
export default getters
