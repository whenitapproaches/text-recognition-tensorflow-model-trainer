import Vuex from 'vuex'
import Vue from 'vue'
import modules from '@/store/modules'

Vue.use(Vuex)

export default new Vuex.Store({
    modules
})