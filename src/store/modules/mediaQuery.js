const state = {
    media: {}
}

const mutations = {
    SET_MEDIA: (state, media) => {
        state.media = media
    },
}

const actions = {
    setMedia({ commit }, media) {
        commit('SET_MEDIA', media)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
