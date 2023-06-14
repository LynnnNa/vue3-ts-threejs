<template>
	<div id="demo" class="demo"></div>
</template>
<script lang="ts">
import ThreeJs from '@/views/GeometryCube/index'
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
	name: 'GeometryCube',
	props: {},
	setup() {
		onMounted(() => {
			new ThreeJs()
		})
	},
})
</script>
<style scoped lang="scss"></style>
