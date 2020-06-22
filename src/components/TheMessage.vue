<template>
	<transition enter-active-class="animate__fadeIn animate__faster animate__animated" leave-active-class="animate__fadeOut animate__faster animate__animated">
		<div v-show="message.isShown" class="message" :class="message.type">{{message.content}}</div>
	</transition>
</template>

<script>
import { mapGetters } from "vuex"
import debounce from "lodash/debounce"
export default {
	name: "TheMessage",
	computed: {
		...mapGetters({
			message: "Message/getMessage"
		})
	},
	methods: {
		hideMessage() {
			this.$store.dispatch("Message/hideMessage")
		}
	},
	watch: {
		message(msg) {
			if (!msg.isShown) return
			this.debounceMessage()
		}
	},
	mounted() {
		this.debounceMessage = debounce(this.hideMessage, 3000)
		this.$store.dispatch("Message/sendMessage", {
			content: "Hello",
			type: "success"
		})
	}
}
</script>

<style scoped lang="scss">
.message {
	position: fixed;
	left: 100px;
	bottom: 60px;
	padding: 1rem 3rem;
	font-size: 1.25rem;
	font-weight: bold;
  letter-spacing: 0.1rem;
  border-radius: 0;
  color: var(--white);
	&.success {
		background-color: var(--primary-green);
	}
	&.error {
		background-color: var(--primary-red);
	}
}
</style>