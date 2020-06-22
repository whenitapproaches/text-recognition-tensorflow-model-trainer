<template>
	<div class="file has-name is-boxed">
		<label class="file-label">
			<input :accept="accept" class="file-input" type="file" @change="uploadFile($event)" :multiple="multiple" ref="input"/>
			<span class="file-cta has-color-gray has-text-centered">
				<span class="file-label">
					<slot></slot>
				</span>
			</span>
			<span class="file-name has-text-centered">{{fileName}}</span>
		</label>
	</div>
</template>

<script>
export default {
	name: "BaseFileUploader",
	data() {
		return {
			fileName: "Please choose a file..."
		}
	},
	props: {
		accept: {
			type: String
		},
		text: {
			type: String
		},
		multiple: {
			type: String
		}
	},
	methods: {
		uploadFile(e) {
			this.fileName = e.target.files[0].name
			this.$emit("uploadFile", e)
		}
	}
}
</script>

<style scoped lang="scss">
.file {
	border-radius: 0;
	font-size: 1rem;
}
.file-label {
	&:hover {
		.file-cta {
			background-color: var(--primary-red);
			color: var(--white);
		}
		.file-name {
			border-color: var(--primary-red);
			border-width: 0px 2px 2px !important;
			color: var(--black);
		}
	}
}
.file-cta,
.file-name {
	border-radius: 0 !important;
}
.file-name {
	border-color: var(--secondary-red);
	border-width: 0px 2px 2px !important;
	padding: 0.5rem 1rem;
}
.file-cta {
	background-color: var(--secondary-red);
	color: var(--white);
	padding: 0.75rem 3rem !important;
	border: none;
	letter-spacing: 0.1rem;
	font-weight: bold;
}
.file.is-green {
	.file-cta {
		background-color: var(--secondary-green);
	}
	.file-name {
		border-color: var(--secondary-green);
	}
	.file-label {
		&:hover {
			.file-cta {
				background-color: var(--primary-green);
			}
			.file-name {
				border-color: var(--primary-green);
			}
		}
	}
}
</style>