import Vue from "vue"

const initialState = () => ({
  message: {
    content: "",
    type: "",
    isShown: false,
  },
})

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    getMessage: (state) => state.message,
  },
  actions: {
    sendMessage({ commit }, msg) {
      msg.isShown = true
      commit("setMessage", msg)
    },
    hideMessage({ commit }) {
      commit("setHideMessage")
    },
  },
  mutations: {
    setMessage(state, msg) {
      Vue.set(state, "message", msg)
    },
    setHideMessage(state) {
      Vue.set(state.message, "isShown", false)
    },
    resetMessage(state) {
      let newState = initialState()
      Vue.set(state, "message", newState.message)
    },
  },
}
