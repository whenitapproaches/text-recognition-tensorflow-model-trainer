import * as tf from "@tensorflow/tfjs"
import characters from "@/assets/js/training_characters.js"
const IMAGE_WIDTH = 28
const IMAGE_HEIGHT = 28
const IMAGE_CHANNELS = 1

const getModel = function() {
  let model = tf.sequential()
  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling",
    })
  )

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

  // Repeat another conv2d + maxPooling stack.
  // Note that we have more filters in the convolution.
  model.add(
    tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling",
    })
  )
  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }))

  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten())

  // Our last layer is a dense layer which has 10 output units, one for each
  model.add(
    tf.layers.dense({
      units: characters.length,
      kernelInitializer: "varianceScaling",
      activation: "softmax",
    })
  )

  const optimizer = tf.train.adam()

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  })

  return model
}

const initialState = () => ({
  train: {
    Xs: [],
    Ys: [],
  },
  test: {
    Xs: [],
    Ys: [],
  },
  trainingComponents: [],
  testComponents: [],
  model: getModel(),
})

function toTensor(imageData1Channel) {
  return tf
    .tensor(imageData1Channel)
    .reshape([1, IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS])
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    getTrainingComponents: (state) => state.trainingComponents,
    getTestComponents: (state) => state.testComponents,
  },
  actions: {
    async loadStorageModel({ state, dispatch }) {
      try {
        let model = await tf.loadLayersModel("localstorage://my-model")
        const optimizer = tf.train.adam()

        model.compile({
          optimizer: optimizer,
          loss: "categoricalCrossentropy",
          metrics: ["accuracy"],
        })
        state.model = model
        dispatch(
          "Message/sendMessage",
          {
            content: "Model Storage Loaded",
            type: "success",
          },
          {
            root: true,
          }
        )
      } catch (err) {
        console.log(err)
      }
    },
    CLEAR({ state }) {
      state.train = {
        Xs: [],
        Ys: [],
      }
      state.test = {
        Xs: [],
        Ys: [],
      }
      state.trainingComponents = []
      state.testComponents = []
    },
    loadModel({ state, dispatch }, files) {
      let io = tf.io.browserFiles(files)
      tf.loadLayersModel(io)
        .then((model) => {
          console.log(model)
          state.model = model
          dispatch(
            "Message/sendMessage",
            {
              content: "Model Loaded",
              type: "success",
            },
            {
              root: true,
            }
          )
        })
        .catch((err) => console.log(err))
    },
    saveModel({ state, dispatch }) {
      state.model
        .save("localstorage://my-model")
        .then(() =>
          dispatch(
            "Message/sendMessage",
            {
              content: "Model Saved",
              type: "success",
            },
            {
              root: true,
            }
          )
        )
        .catch((err) => console.log(err))
    },
    downloadModel({ state, dispatch }) {
      state.model
        .save("downloads://my-model")
        .then(() =>
          dispatch(
            "Message/sendMessage",
            {
              content: "Model Downloaded",
              type: "success",
            },
            {
              root: true,
            }
          )
        )
        .catch((err) => console.log(err))
    },
    addTrainXs({ commit }, xs) {
      commit("pushTrainXs", xs)
    },
    addTrainYs({ commit }, ys) {
      commit("pushTrainYs", ys)
    },
    addTestXs({ commit }, xs) {
      commit("pushTestXs", xs)
    },
    addTestYs({ commit }, ys) {
      commit("pushTestYs", ys)
    },
    addTrainingComponents({ commit, dispatch }, instance) {
      commit("addTrainingComponents", instance)
      dispatch(
        "Message/sendMessage",
        {
          content: "Added",
          type: "success",
        },
        {
          root: true,
        }
      )
    },
    addTestComponents({ commit, dispatch }, instance) {
      commit("addTestComponents", instance)
      dispatch(
        "Message/sendMessage",
        {
          content: "Added",
          type: "success",
        },
        {
          root: true,
        }
      )
    },
    train({ state, dispatch }) {
      // Check if there is any data
      if (!state.train.Xs.length) {
        return dispatch(
          "Message/sendMessage",
          {
            content: `Please push data first`,
            type: "error",
          },
          {
            root: true,
          }
        )
      }
      // Check if there is any validation data
      if (!state.test.Xs.length) {
        return dispatch(
          "Message/sendMessage",
          {
            content: `Please push validation data`,
            type: "error",
          },
          {
            root: true,
          }
        )
      }
      let data = tf
        .tensor(state.train.Xs)
        .reshape([
          state.train.Xs.length,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          IMAGE_CHANNELS,
        ])
        .div(255)
      let labels = tf.tensor(state.train.Ys)
      let testData = tf
        .tensor(state.test.Xs)
        .reshape([
          state.test.Xs.length,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          IMAGE_CHANNELS,
        ])
        .div(255)
      let testLabels = tf.tensor(state.test.Ys)
      state.model
        .fit(data, labels, {
          epochs: 10,
          shuffle: true,
          validationData: [testData, testLabels],
        })
        .then(() =>
          dispatch(
            "Message/sendMessage",
            {
              content: `Model trained`,
              type: "success",
            },
            {
              root: true,
            }
          )
        )
        .catch((err) => console.log(err))
    },
    predictOne({ state, dispatch }, imageData1Channel) {
      let tensor = toTensor(imageData1Channel).div(255)
      let predict = state.model.predict(tensor).argMax(-1)
      let character = characters[predict.dataSync()[0]]
      dispatch(
        "Message/sendMessage",
        {
          content: `Prediction: ${character}`,
          type: "success",
        },
        {
          root: true,
        }
      )
    },
  },
  mutations: {
    pushTrainXs(state, xs) {
      state.train.Xs.push(xs)
    },
    pushTrainYs(state, ys) {
      state.train.Ys.push(ys)
    },
    addTrainingComponents(state, instance) {
      state.trainingComponents.push(instance)
    },
    pushTestXs(state, xs) {
      state.test.Xs.push(xs)
    },
    pushTestYs(state, ys) {
      state.test.Ys.push(ys)
    },
    addTestComponents(state, instance) {
      state.testComponents.push(instance)
    },
  },
}
