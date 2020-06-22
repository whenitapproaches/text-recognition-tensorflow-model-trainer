<template>
	<div id="app">
		<TheNavigationBar @changetab="changeTab" :tabs="tabs" :currentTab="currentTab" />
		<div class="main">
			<h1 class="title is-1 has-text-centered mb-6">Tensorflow.js Text Recognition Model Generator</h1>
			<keep-alive>
				<component :is="currentTab" :ref="currentTab" />
			</keep-alive>
		</div>
		<TheMessage />
		<img class="decorator-wave" style="opacity: 0.5" src="@/assets/svgs/decorator-wave.svg" />
    <img class="decorator-wave" style="opacity: 0.5; top: 0; bottom: none" src="@/assets/svgs/decorator-wave-top.svg" />
		<img class="decorator-wave" style="left: 40%; opacity: 0.25;" src="@/assets/svgs/decorator-wave.svg" />
	</div>
</template>

<script>
import TheTraining from "@/components/TheTraining"
import TheSample from "@/components/TheSample"
import TheNavigationBar from "@/components/TheNavigationBar"
import TheMessage from "@/components/TheMessage"
export default {
	name: "App",
	data() {
		return {
			currentTab: "TheTraining",
			tabs: [
				{
					name: "Training",
					component: "TheTraining"
				},
				{
					name: "Samples",
					component: "TheSample"
				}
			]
		}
	},
	methods: {
		changeTab(component) {
			this.currentTab = component
		}
	},
	components: {
		TheTraining,
		TheSample,
		TheNavigationBar,
		TheMessage
	},
	created() {
		this.$store.dispatch("Training/loadStorageModel")
	}
}
</script>

<style lang="scss">
@import "../node_modules/bulma/bulma";
@import "../node_modules/animate.css/animate.min.css";
@import url("https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap");
#app,
select,
input {
	font-family: "Mukta", sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	position: relative;
	background-color: #fffcf9;
	height: 100vh;
}
.main {
	padding: 30px 120px;
	z-index: 100;
	position: relative;
}
:root {
	--primary-red: #ff6978;
	--secondary-red: #ffadb6;
	--primary-green: #4f9d69;
	--secondary-green: #92c8a4;
	--white: #fffcf9;
	--black: #25283d;
	--gray: #818aa3;
}
.has-color-gray {
	color: #818aa3;
}
.decorator-wave {
	position: fixed;
	width: 100%;
	bottom: -15%;
	left: 0;
	height: auto;
}
</style>
