<template>
	<div style="height: -webkit-fill-available; height: -moz-fill-available; width: 100%; height: 100%">
		<router-view v-slot="{ Component }">
			<keep-alive>
				<a-config-provider :locale="zhCN">
					<component :is="Component" />
				</a-config-provider>
			</keep-alive>
		</router-view>
	</div>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
		return {
			zhCN,
			moment,
		}
	},
})
</script>
<style lang="scss" scoped></style>
