<template>
	<div>
		<div class="columns">
			<div class="column">
				<div class="is-size-2 has-text-centered mb-5">Training Samples</div>
				<div v-if="!trainingComponents.length" class="has-text-centered">Empty</div>
				<div class="training-data-container columns is-multiline" ref="trainingDataContainer">
					<div
						v-for="(comp, index) in trainingComponents"
						:key="`sample${index}`"
						class="column is-narrow"
					>
						<ImageSample :dataURL="comp.dataURL" :label="comp.label" />
					</div>
				</div>
			</div>
			<div class="column">
				<div class="is-size-2 has-text-centered mb-5">Validation Samples</div>
				<div v-if="!testComponents.length" class="has-text-centered">Empty</div>
				<div class="test-data-container columns is-multiline" ref="trainingDataContainer">
					<div v-for="(comp, index) in testComponents" :key="`sample${index}`" class="column is-narrow">
						<ImageSample :dataURL="comp.dataURL" :label="comp.label" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"
import ImageSample from "@/components/ImageSample"
export default {
	name: "TheSample",
	computed: {
		...mapGetters({
			trainingComponents: "Training/getTrainingComponents",
			testComponents: "Training/getTestComponents"
		})
	},
	components: {
		ImageSample
	}
}
</script>

<style scoped lang="scss">
.training-data-container,
.test-data-container {
	max-height: 60vh;
	overflow-y: auto;
	align-items: flex-start;
}
.training-data-container {
	&::-webkit-scrollbar {
		width: 16px;
	}
	&::-webkit-scrollbar-track {
		background: var(--secondary-green);
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
    background: var(--white);
    border: 4px solid var(--secondary-green)
	}
}
.test-data-container {
	&::-webkit-scrollbar {
		width: 16px;
	}
	&::-webkit-scrollbar-track {
		background: var(--secondary-red);
	}

	/* Handle */
	&::-webkit-scrollbar-thumb {
    background: var(--white);
    border: 4px solid var(--secondary-red)
	}
}
</style>