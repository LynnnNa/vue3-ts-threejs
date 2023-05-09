<template>
	<div id="demo" class="demo"></div>
</template>
<script lang="ts">
import ThreeJs from "@/views/ThreeDemo/index"
import { defineComponent, onMounted } from "vue"
export default defineComponent({
	name: "ThreeDemo",
	props: {},
	setup() {
		onMounted(() => {
			new ThreeJs()
		})
	},
})
</script>
<style scoped lang="scss"></style>
