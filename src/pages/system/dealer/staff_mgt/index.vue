<template>
	<div>
		<div class="header">
			<a-input v-model:value="search.name" class="search_box" placeholder="姓名" style="width: 180px" allow-clear />
			<a-input v-model:value="search.code" class="search_box" placeholder="编码" style="width: 180px" allow-clear />
			<a-select v-model:value="search.status" class="pick_view" placeholder="状态" style="width: 128px" allow-clear @change="handleChange">
				<a-select-option value="1"> 在用</a-select-option>
				<a-select-option value="9"> 停用</a-select-option>
			</a-select>

			<a-button class="btn" type="primary" @click="getList">查询</a-button>
			<a-button class="btn" @click="reset">重置</a-button>
			<span style="display: flex; justify-content: flex-end"> 经销商：{{ ealerName.name }} </span>
		</div>

		<div class="table_view" style="margin-top: 30px">
			<a-table key="columns" :columns="columns" :data-source="dataList" :pagination="false">
				<template #status="{ record }">
					<a-tag v-if="record.status == '0'" color="red"> 未授权</a-tag>
					<a-tag v-if="record.status == '1'" color="green"> 在用</a-tag>
					<a-tag v-if="record.status == '9'" color="volcano"> 停用</a-tag>
				</template>
				<template #action="{ record }">
					<span>
						<a href="javascript:;" @click="seeList(record)">查看</a>
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
			<a-modal
				v-model:visible="visible"
				title="查看"
				width="560px"
				ok-text="关闭"
				:cancel-button-props="{ style: { display: 'none' } }"
				@ok="handleOk"
				@cancel="cancelBtn"
			>
				<a-form ref="roleRef" :rules="roleRule" :model="updateForm" :label-col="labelCol" :wrapper-col="wrapperCol">
					<a-row>
						<a-col :span="12">
							<a-form-item label="编号" label-align="right">
								<a-input v-model:value="updateForm.code" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="账号" label-align="right">
								<a-input v-model:value="updateForm.code" disabled />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<a-form-item label="姓名" label-align="right">
								<a-input v-model:value="updateForm.name" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="性别" label-align="right">
								<a-input v-model:value="updateForm.sexName" disabled />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<a-form-item label="Email" label-align="right">
								<a-input v-model:value="updateForm.email" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="手机号码" label-align="right" name="mobilephone">
								<a-input v-model:value="updateForm.mobilephone" disabled />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<a-form-item label="办公号码" label-align="right" name="officephone">
								<a-input v-model:value="updateForm.officephone" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="状态" label-align="right" name="statusName">
								<a-input v-model:value="updateForm.statusName" disabled />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<a-form-item label="部门" label-align="right" name="deptName">
								<a-input v-model:value="updateForm.deptName" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="角色" label-align="right" name="roleName">
								<a-input v-model:value="updateForm.roleName" disabled />
							</a-form-item>
						</a-col>
					</a-row>
				</a-form>
			</a-modal>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { getRoleDetail, getRoleList } from '@/api/other'
const columns = [
	{
		title: '编号',
		dataIndex: 'code',
		key: 'code',
	},
	{
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		dataIndex: 'code',
		key: 'code ',
		title: '账号',
	},
	{
		title: '性别',
		dataIndex: 'sexName',
		key: 'sexName',
	},
	{
		title: '部门',
		dataIndex: 'deptName',
		key: 'deptName',
	},
	{
		title: '角色',
		dataIndex: 'roleName',
		key: 'roleName',
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		slots: { customRender: 'status' },
	},
	{
		title: '修改人',
		dataIndex: 'updateUserName',
		key: 'updateUserName ',
		slots: { customRender: 'updateUserName' },
	},
	{
		title: '修改时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
		slots: { customRender: 'updateTime' },
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		slots: { customRender: 'action' },
	},
]
const searchList = () => ({
	current: 1,
	size: 10,
	name: '', // 姓名
	code: '', // 编码
	status: undefined, // 状态：0-未授权、1-在用 、9-停用 ,
	type: 2, // 类型：1-总部 2-经销商 3-经销商管理员
	dealerId: '',
})
export default defineComponent({
	components: {
		PlusOutlined,
		VerticalAlignBottomOutlined,
	},
	setup() {
		onMounted(() => {
			console.log(route.query)
			ealerName.name = route.query.name
			search.value.dealerId = route.query.id
			getList()
		})
		// 查询 -- 列表 --  -- 总条数
		const search = ref(searchList())
		const dataList = ref([])
		const total = ref<any>()
		const route = useRoute()
		const ealerName = reactive({ name: null })
		const getList = () => {
			getRoleList(search.value).then(({ data }) => {
				dataList.value = data.data.records
				total.value = data.data.total
			})
		}
		// 下拉列表
		const handleChange = (value: number) => {
			search.value.status = value
			console.log(value)
		}

		// 重置
		const reset = () => {
			search.value = searchList()
			search.value.dealerId = route.query.id
			getList()
		}

		// 查看
		const visible = ref<boolean>(false)
		const updateForm = ref<object>()

		const seeList = (row: Object) => {
			getRoleDetail({ id: row.id }).then(({ data }) => {
				updateForm.value = data.data
				visible.value = true
			})
		}
		const handleOk = () => {
			visible.value = false
		}

		// 分页
		const showSizeChange = (current: number, size: number) => {
			search.value.current = current
			search.value.size = size
			getList()
		}
		const change = (current: number, size: number) => {
			search.value.current = current
			search.value.size = size
			getList()
		}
		return {
			search,
			columns,
			dataList,
			total,
			visible,
			updateForm,
			ealerName,

			//  fun
			getList,
			handleChange,
			reset,
			handleOk,
			seeList,
			showSizeChange,
			change,

			labelCol: { span: 7 },
			wrapperCol: { span: 24 },
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
