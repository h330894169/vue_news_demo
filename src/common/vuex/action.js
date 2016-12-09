const state = {
    leftNavState: false,
    loading: false
}

export const changeLeftNavState = ({commit}, isShow) => {
    commit('CHANGE_LEFTNAV_STATE', isShow)
}