<route lang="yaml">
meta:
    title: 日志管理
</route>

<template>
	<div>
		<div class="header">
			<a-form ref="searchRef" :model="search" class="flex flex-warp">
				<a-form-item name="rizhi" class="search_box">
					<a-select v-model:value="search.rizhi" placeholder="日志类型" style="width: 127px" allow-clear @change="handleChange">
						<a-select-option value="1"> 登录日志</a-select-option>
						<a-select-option value="9"> 登出日志</a-select-option>
						<a-select-option value="9"> 登录异常</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item class="search_box">
					<a-range-picker v-model:value="valueTime" format="YYYY-MM-DD HH:mm:ss" @change="searchTime" />
				</a-form-item>
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="search.name" placeholder="姓名" style="width: 377px" allow-clear />
				</a-form-item>
				<a-form-item>
					<a-button class="btn" type="primary" @click="getDealerList">查询</a-button>
					<a-button class="btn" @click="resetSearch">重置</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div style="margin-top: 30px">
			<a-table key="columns" :columns="columns" :data-source="dealerList" :pagination="false">
				<template #type="{ record }">
					<span>
						<div>日志类型——------- {{ record }}</div>
					</span>
				</template>
			</a-table>
			<div style="display: flex; justify-content: flex-end; margin-top: 20px">
				<a-pagination
					size="small"
					:total="total"
					show-size-changer
					show-quick-jumper
					:page-size-options="['10', '20', '50', '100']"
					:show-total="(total) => `共有 ${total} 条`"
					@showSizeChange="showSizeChange"
					@change="change"
				/>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { dealerRoleList } from '@/api/other'
const columns = [
	{
		title: '日志类型',
		dataIndex: 'type',
		key: 'type',
		slots: { customRender: 'type' },
	},
	{
		title: '员工姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '账号',
		dataIndex: 'fullName',
		key: 'fullName',
	},
	{
		title: '员工类型',
		dataIndex: 'bigAreaName',
		key: 'bigAreaName',
	},
	{
		title: '所属部门',
		dataIndex: 'dmsStatus',
		key: 'dmsStatus',
	},
	{
		title: '角色',
		dataIndex: 'mmsStatus',
		key: 'mmsStatus',
	},
	{
		title: '操作信息',
		dataIndex: 'accountStatus',
		key: 'accountStatus',
	},
	{
		title: '操作时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
	},
]
interface search {
	rizhi: string | undefined
	orderBeginDate: string
	orderEndDate: string
	name: string
	size: number
	current: number
}

export default defineComponent({
	setup() {
		const search = reactive<search>({
			rizhi: undefined,
			orderBeginDate: '',
			orderEndDate: '',
			name: '',
			size: 1,
			current: 10,
		})
		onMounted(() => {
			getJournalList()
		})
		const dealerList = ref([])
		const valueTime = ref()
		const total = ref<number>(1)
		const searchTime = (date: string, dateArray: string) => {
			search.orderBeginDate = dateArray[0]
			search.orderEndDate = dateArray[1]
			console.log(search)
		}

		// 查询
		const getJournalList = () => {
			console.log('查询')
			console.log(search)
		}
		// 清空
		const searchRef = ref(null)
		const resetSearch = () => {
			searchRef.value.resetFields()
			valueTime.value = ''
			getJournalList()
			console.log(search)
		}
		const handleChange = () => {}
		const handleChangeTow = () => {}
		const handleChangeThree = () => {}

		// 分页
		const showSizeChange = (current: number, size: number) => {
			search.current = current
			search.size = size
			getJournalList()
		}
		const change = (current: number, size: number) => {
			search.current = current
			search.size = size
			getJournalList()
		}
		return {
			columns,
			dealerList,
			valueTime,
			search,
			total,
			searchRef,

			searchTime,
			getJournalList,
			resetSearch,
			handleChange,
			handleChangeTow,
			handleChangeThree,
			showSizeChange,
			change,
		}
	},
})
</script>
<style lang="scss" scoped>
.header {
	padding-bottom: 17px;
	border-bottom: 1px solid #ebedf0;
	.search_box {
		margin-right: 10px;
	}

	.pick_view {
		margin-right: 10px;
	}

	.btn {
		margin: 0 5px;
	}
}

.add_view {
	padding: 20px 0;

	.export_btn {
		margin-left: 30px;
		float: right;
	}
}

.form-title {
	width: 56px;
	height: 20px;
	font-size: 14px;
	font-family: PingFang SC-Medium, PingFang SC;
	font-weight: 500;
	color: #19191a;
	margin-bottom: 10px;
}
</style>
