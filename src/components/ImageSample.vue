<template>
	<div class="sample">
		<img :src="dataURL" width="50px" height="50px" />
		<div class="label has-text-centered has-color-gray">
			<p>{{label}}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: "ImageSample",
	props: {
		dataURL: {
			type: String
		},
		label: {
			type: String
		}
	}
}
</script>

<style>
</style>