<template>
	<div>
		<div class="columns is-vcentered">
			<div class="column is-3">
				<div class="image__container">
					<div class="image__header">
						<div class="columns is-vcentered">
							<div class="column is-narrow">
								<div class="options__switch mb-5">
									<p class="pr-3 is-size-5 has-color-gray">Binary Image:</p>
									<label class="switch">
										<input v-model="viewBinaryImage" class="is-hidden" type="checkbox" />
										<span class="slider"></span>
									</label>
								</div>
							</div>
							<div class="column mb-5 pl-5">
								<div class="predict">
									<button @click="predict" class="button is-fullwidth">Predict</button>
								</div>
							</div>
						</div>
					</div>
					<div ref="canvasImage" class="image">
						<div class="binary-image" v-show="viewBinaryImage">
							<div class="binary-image__container">
								<div
									v-for="(pixel, index) in canvasImageData1Channel"
									:key="`pixel${index}`"
									class="binary-image__item"
									:style="{'background-color': `rgba(255, 255, 255, ${pixel / 255}`}"
								></div>
							</div>
						</div>
						<canvas
							@mousedown="moveCanvas($event)"
							@mouseleave="leaveCanvas($event)"
							@mousemove="movingCanvas($event)"
							@mouseup="leaveCanvas($event)"
							:style="{'cursor': (isMovingCanvas) ? 'grabbing' : '', 'transform': `scale(${canvasScale})`}"
							id="myCanvas"
							width="28"
							height="28"
						></canvas>
					</div>
					<div class="image__info has-text-centered mt-5">
						<p>28x28 Sample</p>
						<div class="image__upload is-flex flex-center mt-4">
							<BaseFileUploader accept=".jpg, .jpeg, .png" @uploadFile="uploadedImage">Upload your image</BaseFileUploader>
						</div>
					</div>
				</div>
			</div>
			<div class="column">
				<div class="columns">
					<div class="column"></div>
					<div class="column is-narrow">
						<div class="options is-flex mb-4">
							<div class="options__switch">
								<p>Predict Random Character:</p>
								<label class="switch">
									<input v-model="predictRandom" class="is-hidden" type="checkbox" />
									<span class="slider"></span>
								</label>
							</div>
							<div class="options__switch">
								<p>Randomise on Predict:</p>
								<label class="switch">
									<input v-model="randomiseOnPredict" class="is-hidden" type="checkbox" />
									<span class="slider"></span>
								</label>
							</div>
							<div class="options__switch">
								<p>Randomise on Push:</p>
								<label class="switch">
									<input v-model="randomiseOnPush" class="is-hidden" type="checkbox" />
									<span class="slider"></span>
								</label>
							</div>
							<div class="options__switch">
								<p>Randomise on New Character:</p>
								<label class="switch">
									<input v-model="isRandomised" class="is-hidden" type="checkbox" />
									<span class="slider"></span>
								</label>
							</div>
						</div>
					</div>
				</div>
				<div class="characters mb-5">
					<div class="columns is-multiline">
						<div v-for="character in characters" :key="character" class="is-1 column">
							<div
								@click="setCurrentCharacter(character)"
								:class="{'is-chosen': currentCharacter === character}"
								class="character"
							>{{character}}</div>
						</div>
					</div>
				</div>
				<div class="text-options">
					<div class="columns">
						<div class="column is-3">
							<div class="columns is-multiline">
								<div class="column is-12">
									<p class="mb-2">Font Size: {{fontSize}}px</p>
									<div class="slider-container">
										<input type="range" min="24" max="32" v-model="fontSize" class="slider" />
									</div>
								</div>
								<div class="column is-12">
									<p class="mb-2">Font Family: {{fontFamily}}</p>
									<BaseSelect :options="fontFamilyChoices" v-model="fontFamily" />
								</div>
							</div>
						</div>
						<div class="column is-3 is-offset-1">
							<div class="columns is-multiline">
								<div class="column is-12">
									<p class="mb-2">Train Batch Size: {{pushTrainBatchSize}}</p>
									<div class="slider-container is-green">
										<input type="range" min="0" max="20" v-model="pushTrainBatchSize" class="slider" />
									</div>
								</div>
								<div class="column is-12">
									<p class="mb-2">Validation Data Batch Size: {{pushTestBatchSize}}</p>
									<div class="slider-container is-green">
										<input type="range" min="0" max="20" v-model="pushTestBatchSize" class="slider" />
									</div>
								</div>
							</div>
						</div>
						<div class="column is-2 is-offset-1">
							<div class="columns is-multiline mt-5">
								<div class="column is-12">
									<button @click="pushOne" class="button is-fullwidth">Push One</button>
								</div>
								<div class="column is-12">
									<button @click="pushAll" class="button is-fullwidth">Push All</button>
								</div>
								<div class="column is-12">
									<button @click="clear" class="button is-fullwidth">Clear All</button>
								</div>
							</div>
						</div>
						<div class="column is-2">
							<div class="columns is-multiline mt-5">
								<div class="column is-12">
									<button @click="train" class="button is-green is-fullwidth">Train Model</button>
								</div>
								<div class="column is-12">
									<button @click="saveModel" class="button is-green is-fullwidth">Save Model to Browser</button>
								</div>
								<div class="column is-12">
									<button @click="downloadModel" class="button is-green is-fullwidth">Download Model</button>
								</div>
								<div class="column is-12">
									<BaseFileUploader
										class="is-fullwidth is-green"
										accept=".json, .bin"
										@uploadFile="uploadedModel"
										multiple
									>Load Model</BaseFileUploader>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
import BaseSelect from "@/components/BaseSelect"
import BaseFileUploader from "@/components/BaseFileUploader"
export default {
	name: "TheTraining",
	data() {
		return {
			canvas: "",
			canvasContext: "",
			currentCharacter: "",
			isRandomised: false,
			x: 0,
			y: 28,
			fontSize: 28,
			isMovingCanvas: false,
			moveSpeed: 0.5,
			fontFamily: "",
			fontFamilyChoices: ["Soxe2banh", "Arial", "Roboto"],
			pushTrainBatchSize: 1,
			pushTestBatchSize: 0,
			canvasScale: 0,
			viewBinaryImage: false,
			canvasImageData1Channel: "",
			randomiseOnPush: false,
			randomiseOnPredict: false,
			predictRandom: false
		}
	},
	components: {
		BaseSelect,
		BaseFileUploader
	},
	computed: {
		...mapGetters({
			characters: "Characters/getCharacters",
			charLabels: "Characters/getCharLabels"
		})
	},
	mounted() {
		this.canvas = document.getElementById("myCanvas")
		this.canvasContext = this.canvas.getContext("2d")
		this.clearCanvas()
		this.setCurrentCharacter(this.characters[0])
		this.fontFamily = this.fontFamilyChoices[0]
		this.scaleCanvas()
		window.addEventListener("resize", this.scaleCanvas)
	},
	watch: {
		fontSize() {
			this.redraw()
		},
		fontFamily() {
			this.redraw()
		}
	},
	methods: {
		scaleCanvas() {
			let canvasImage = this.$refs.canvasImage
			this.canvasScale = canvasImage.clientWidth / 28
		},
		clear() {
			this.$store.dispatch("Training/CLEAR")
			this.$store.dispatch("Message/sendMessage", {
				content: "Cleared!",
				type: "success"
			})
		},
		uploadedModel(e) {
			if (e.target.files.length != 2) {
				this.$store.dispatch("Message/sendMessage", {
					content: "Please choose 2 files json and weight",
					type: "error"
				})
				return
			}
			let uploadedFiles = e.target.files
			let regJson = new RegExp(/.json$/i)
			let regBin = new RegExp(/.bin$/i)
			let files = []
			uploadedFiles.forEach(file => {
				if (regJson.test(file.name)) files[0] = file
				if (regBin.test(file.name)) files[1] = file
			})
			this.$store.dispatch("Training/loadModel", files)
		},
		saveModel() {
			this.$store.dispatch("Training/saveModel")
		},
		downloadModel() {
			this.$store.dispatch("Training/downloadModel")
		},
		train() {
			this.$store.dispatch("Training/train")
		},
		predict() {
			if (!this.img) {
				if (this.predictRandom)
					this.currentCharacter = this.characters[
						this.getRandomInt(0, this.characters.length)
					]
				if (this.randomiseOnPredict) {
					this.randomise()
				}
				this.redraw()
			}
			this.$store.dispatch("Training/predictOne", this.canvasImageData1Channel)
		},
		pushOne() {
			let i = 0
			while (i < this.pushTrainBatchSize) {
				if (this.randomiseOnPush) {
					this.randomise()
					this.clearCanvas()
					this.draw()
				}
				if (!this.img) {
					this.redraw()
				}
				this.pushTrain()
				i++
			}
			let j = 0
			while (j < this.pushTestBatchSize) {
				if (this.randomiseOnPush) {
					this.randomise()
				}
				if (!this.img) {
					this.redraw()
				}
				this.pushTest()
				j++
			}
		},
		pushAll() {
			this.img = ""
			this.x = 0
			this.y = 28
			this.characters.forEach(character => {
				this.currentCharacter = character
				this.pushOne()
			})
		},
		generateImageSample(type) {
			let dataURL = this.canvas.toDataURL()
			let label = this.currentCharacter
			this.$store.dispatch(`Training/add${type}Components`, {
				dataURL: dataURL,
				label: label
			})
		},
		pushTrain() {
			this.generateImageSample("Training")
			this.$store.dispatch("Training/addTrainXs", this.canvasImageData1Channel)
			this.$store.dispatch(
				"Training/addTrainYs",
				this.charLabels[this.currentCharacter]
			)
		},
		pushTest() {
			this.generateImageSample("Test")
			this.$store.dispatch("Training/addTestXs", this.canvasImageData1Channel)
			this.$store.dispatch(
				"Training/addTestYs",
				this.charLabels[this.currentCharacter]
			)
		},
		clearCanvas() {
			this.canvasContext.fillStyle = "#000"
			this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
		},
		draw() {
			this.canvasContext.fillStyle = "#fff"
			this.canvasContext.font = `${this.fontSize}px ${this.fontFamily}`
			this.canvasContext.fillText(this.currentCharacter, this.x, this.y)
			this.generateCanvasImageData1Channel()
		},
		generateCanvasImageData1Channel() {
			let imageData1Channel = []
			let imageData = this.canvasContext.getImageData(
				0,
				0,
				this.canvas.width,
				this.canvas.height
			).data
			for (let i = 0; i < imageData.length; i += 4) {
				let pixel = Math.floor(
					(imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
				)
				imageData1Channel.push(pixel)
			}
			this.canvasImageData1Channel = imageData1Channel
		},
		setCurrentCharacter(character) {
			if (this.img) {
				this.x = 0
				this.y = 28
			}
			if (this.isRandomised) this.randomise()
			this.currentCharacter = character
			this.img = ""
			this.redraw()
		},
		randomise() {
			this.x = this.getRandomInt(0, 16)
			this.y = this.getRandomInt(26, 28)
			this.fontSize = this.getRandomInt(24, 32)
		},
		getRandomInt(min, max) {
			return Math.floor(Math.random() * Math.floor(max - min) + Math.floor(min))
		},
		moveCanvas(e) {
			this.isMovingCanvas = true
			this.firstMoveX = e.offsetX
			this.firstMoveY = e.offsetY
		},
		movingCanvas(e) {
			if (this.isMovingCanvas) {
				this.x += (e.offsetX - this.firstMoveX) * this.moveSpeed
				this.y += (e.offsetY - this.firstMoveY) * this.moveSpeed
				this.firstMoveX = e.offsetX
				this.firstMoveY = e.offsetY
				this.redraw()
			}
		},
		leaveCanvas() {
			this.isMovingCanvas = false
		},
		redraw() {
			this.clearCanvas()
			if (this.img) {
				this.canvasContext.drawImage(
					this.img,
					this.x,
					this.y,
					this.imageWidth,
					this.imageHeight
				)
				return this.generateCanvasImageData1Channel()
			}
			this.draw()
		},
		uploadedImage(e) {
			let file = e.target.files[0]
			var img = new Image()
			img.src = window.URL.createObjectURL(file)
			img.onload = () => {
				this.img = img
				this.x = 0
				this.y = 0
				let imageRatio = img.width / img.height
				this.imageWidth = img.width < 28 ? 28 : 56
				this.imageHeight = this.imageWidth * imageRatio
				this.clearCanvas()
				this.canvasContext.drawImage(
					img,
					0,
					0,
					this.imageWidth,
					this.imageHeight
				)
				this.generateCanvasImageData1Channel()
			}
		}
	}
}
</script>

<style scoped lang="scss">
.image__container {
	margin-right: 40px;
}
.binary-image {
	width: 100%;
	position: absolute;
	height: 100%;
	top: 0;
	left: 0;
	background-color: #25283d;
	z-index: 5;
	&__container {
		display: grid;
		grid-template-columns: repeat(28, minmax(3.57%, 1fr));
		grid-auto-rows: 1fr;
		&::before {
			content: "";
			width: 0;
			padding-bottom: 100%;
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
		& > *:first-child {
			grid-row: 1 / 1;
			grid-column: 1 / 1;
		}
	}
	&__item {
		background-color: #25283d;
		&.is-true {
			background-color: #fffcf9;
		}
	}
}
.image {
	display: flex;
	&::before {
		content: "";
		padding-top: 100%;
	}
	canvas {
		position: absolute;
		transform-origin: top left;
		top: 0;
		left: 0;
		cursor: grab;
	}
}
.image__info {
	color: #818aa3;
	font-weight: normal;
	font-size: 1.25rem;
}
.character {
	text-align: center;
	padding: 1rem 1rem;
	font-weight: bold;
	cursor: pointer;
	font-size: 1.5rem;
	color: #818aa3;
	&:hover {
		color: #25283d;
		background-color: #92c8a4;
	}
	&.is-chosen {
		background-color: #4f9d69;
		color: #fffcf9;
	}
}
.options {
	&__switch {
		display: flex;
		align-items: center;
		&:not(:last-child) {
			padding-right: 1.5rem;
		}
	}
	p {
		padding-right: 1rem;
		font-size: 1.25rem;
	}
}
.switch {
	width: 3rem;
	height: 2rem;
	display: inline-flex;
	cursor: pointer;
	.slider {
		width: 100%;
		height: 100%;
		background-color: #ffadb6;
		position: relative;
		&:before {
			content: "";
			position: absolute;
			top: 10%;
			left: 10%;
			width: 30%;
			height: 80%;
			background-color: #fffcf9;
		}
		&:hover {
			background-color: #ff6978;
		}
	}
	input:checked + .slider {
		background-color: #ff6978;
	}
	input:checked + .slider:before {
		left: 60%;
	}
}
.text-options {
	font-size: 1.25rem;
}
.slider-container {
	display: flex;
	&.is-green {
		.slider {
			background-color: #92c8a4;
			&:hover {
				background-color: #4f9d69;
			}
		}
	}
	.slider {
		appearance: none;
		height: 1.5rem;
		padding: 0.25rem;
		width: 100%;
		background-color: #ffadb6;
		outline: none;
		cursor: pointer;
		&::-webkit-slider-thumb {
			appearance: none;
			background-color: #fffcf9;
			width: 1rem;
			height: 1rem;
		}
		&:hover {
			background-color: #ff6978;
		}
	}
}
.select {
	border-radius: 0;
	select {
		border-radius: 0;
	}
	&:after {
		border-color: #ff6978 !important;
	}
}
button {
	border-radius: 0;
	background-color: #ffadb6;
	color: #fffcf9;
	font-size: 1rem;
	font-weight: bold;
	padding: 1.5rem 2rem;
	outline: none;
	border: none;
	box-shadow: none !important;
	&:focus {
		color: #fffcf9;
	}
	&:hover {
		background-color: #ff6978;
		color: #fffcf9;
	}
	&.is-green {
		background-color: #92c8a4;
		&:hover {
			background-color: #4f9d69;
			color: #fffcf9;
		}
	}
}
.flex-center {
	justify-content: center;
}
</style>