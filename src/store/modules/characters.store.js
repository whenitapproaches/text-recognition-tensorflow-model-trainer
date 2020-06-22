import characters from '@/assets/js/training_characters.js'

const initialState = () => ({
    characters: characters
})

export default {
    namespaced: true,
    state: initialState(),
    getters: {
        getCharacters: state => state.characters,
        getCharLabels: state => {
            let charLabels = {}
            let length = state.characters.length
            state.characters.forEach((val, index) => {
                let arr = []
                for(let i = 0; i < length; i ++) arr.push(0)
                arr[index] = 1
                charLabels[val] = arr
            })
            return charLabels
        }
    },
    actions: {

    },
    mutations: {

    }
}