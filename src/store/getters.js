const getters = {
    sidebar: state => state.app.sidebar,
    language: state => state.app.language,
    langSelect: state => state.settings.langSelect,
    navBarMode: state => state.settings.navBarMode,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    media: state => state.mediaQuery.media
}
export default getters
