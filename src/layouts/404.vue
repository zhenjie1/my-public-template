<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
	<main>
		<div text-4xl>
			<div i-carbon-warning inline-block />
		</div>
		<router-view />
		<div>
			<button btn text-sm m="3 t8" @click="router.back()">返回</button>
		</div>
	</main>
</template>
