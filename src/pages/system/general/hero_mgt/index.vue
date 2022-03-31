<template>
	<div>
		<div class="header">
			<a-form ref="roleRef2" :model="fiflterForm" style="width: 100%; display: flex; flex-wrap: wrap">
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="fiflterForm.name" allow-clear placeholder="名称" @change="sureBtn2" />
				</a-form-item>

				<a-form-item name="code" class="search_box">
					<a-input v-model:value="fiflterForm.code" allow-clear placeholder="编号" @change="sureBtn2" />
				</a-form-item>

				<a-form-item name="status" class="search_box">
					<a-select
						ref="select"
						v-model:value="fiflterForm.status"
						style="width: 180px"
						placeholder="状态"
						:options="roleStatus"
						allow-clear
						@change="sureBtn2"
					></a-select>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" @click.prevent="sureBtn2">查询</a-button>
					<a-button style="margin-left: 10px" @click="cancelBtn2">重置</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div class="add_view">
			<a-button type="primary" @click="addRole"
				><template #icon><PlusOutlined /></template>新增</a-button
			>
			<a-button class="export_btn"
				><template #icon><VerticalAlignBottomOutlined /></template>导出</a-button
			>
		</div>
		<div class="table_view">
			<a-table :columns="columns" :data-source="roleData" :row-selection="rowSelection" :pagination="false">
				<template #status="{ text: status }">
					<a-tag :color="status == '9' ? 'volcano' : 'green'">{{ status == '9' ? '停用' : '在用' }}</a-tag>
				</template>
				<template #action="{ record }">
					<!--all rowData in record   -->
					<span>
						<a @click="edit(record.id)">修改</a>
					</span>
				</template>
			</a-table>
			<div class="pageination">
				<a-pagination
					v-model:current="currentPage"
					v-model:page-size="fiflterForm.size"
					size="small"
					show-quick-jumper
					show-size-changer
					:show-total="(total) => `总共 ${totalPage} 条`"
					:total="totalPage"
					@change="onChange"
					@showSizeChange="showSizeChange"
				/>
			</div>
		</div>

		<a-modal v-model:visible="roleVis" width="60%" :title="roleTitle" wrap-class-name="baseVisible" @ok="sureBtn" @cancel="cancelBtn">
			<a-form ref="roleRef" :model="roleForm" :rules="roleRule" label-align="right" :label-col="labelCol">
				<a-form-item required label="编号" name="code">
					<a-input v-model:value="roleForm.code" placeholder="请输入编号" type="number" />
				</a-form-item>

				<a-form-item required label="名称" name="name">
					<a-input v-model:value="roleForm.name" placeholder="请输入名称" />
				</a-form-item>

				<a-form-item required label="状态" name="status">
					<a-select ref="select" v-model:value="roleForm.status" :options="roleStatus" placeholder="请选择状态" allow-clear></a-select>
				</a-form-item>
				<div class="titleTotal" style="margin-top: 10px; margin-bottom: 10px">
					<div class="titleLeft">分配权限</div>
				</div>

				<tree-table></tree-table>
			</a-form>
		</a-modal>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { addRoleForm, roleDetail, roleList, updateRoleForm } from '@/api/other'
import TreeTable from '@/components/treeTable.vue'

const columns = [
	{
		dataIndex: 'code',
		key: 'code',
		title: '编号',
		width: 160,
		align: 'center',
	},
	{
		title: '名称',
		dataIndex: 'name',
		key: 'name',
		width: 180,
		align: 'center',
	},
	{
		title: '状态',
		dataIndex: 'status',
		key: 'status',
		slots: { customRender: 'status' },
	},
	{
		title: '创建人',
		dataIndex: 'createUserName',
		key: 'createUserName',
		slots: { customRender: 'createUserName' },
	},
	{
		title: '创建时间',
		dataIndex: 'createTime',
		key: 'createTime',
		slots: { customRender: 'createTime' },
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		slots: { customRender: 'action' },
	},
]
interface fiflterForm {
	name: string
	code: string
	status: number | undefined
	size: number
	current: number
}
interface roleForm {
	code: string
	status: string
	name: string
}

const roleStatus = [
	{ label: '在用', value: '1' },
	{ label: '停用', value: '9' },
]
const roleTitle = ref('新增')
const roleData = ref(null)
const rowSelection = {
	onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
	},
	onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
		console.log(record, selected, selectedRows)
	},
	onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
		console.log(selected, selectedRows, changeRows)
	},
}
const roleVis = ref<boolean>(false)

export default defineComponent({
	components: {
		PlusOutlined,
		VerticalAlignBottomOutlined,
		TreeTable,
	},

	setup() {
		onMounted(() => {
			getRoleList(fiflterForm)
		})

		const currentPage = ref<number>(1)
		const totalPage = ref<number>()

		const onChange = (pageNumber: number) => {
			console.log('Page: ', pageNumber)
			fiflterForm.current = pageNumber
			getRoleList(fiflterForm)
		}

		const showSizeChange = (pageNumber: number, pageSize: number) => {
			console.log('page: ', pageNumber)
			console.log('pageSize: ', pageSize)
			fiflterForm.current = pageNumber
			fiflterForm.size = pageSize
			getRoleList(fiflterForm)
		}

		const roleRef = ref(null)
		const roleRef2 = ref(null)
		const roleRule = {
			code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
			name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
			status: [{ required: true, message: '请选择状态', trigger: 'change' }],
		}

		const roleForm = reactive<roleForm>({
			code: '',
			name: '',
			status: '',
			type: 1,
		})
		const fiflterForm = reactive<fiflterForm>({
			code: '',
			name: '',
			status: undefined,
			size: 10,
			current: 1,
			type: 1,
		})
		const addRole = () => {
			roleTitle.value = '新增'
			roleVis.value = true
		}

		const sureBtn = async () => {
			console.log('checkListId', localStorage.getItem('checkListId').split(','))
			// alert(44444444444)
			roleRef.value.validateFields().then(() => {
				if (roleTitle.value == '新增') {
					addRoleFormFct()
				}
				if (roleTitle.value == '编辑') {
					updateRoleFormFct()
				}
				getRoleList(fiflterForm)
			})
			const addRoleFormFct = async () => {
				await addRoleForm(roleForm)
					.then((res) => {
						console.log(res.data.message, 'res.data.message')
						if (res.data.message == 'success') {
							message.success('新增成功')
							roleVis.value = false
						} else {
							message.error(error.data.msg)
						}
					})
					.catch((error) => {
						message.error(error.data.msg)
					})
			}
			const updateRoleFormFct = async () => {
				await updateRoleForm(roleForm)
					.then((res) => {
						console.log(res.data.message, 'res.data.message')
						if (res.data.message == 'success') {
							message.success('修改成功')
							roleVis.value = false
						} else {
							message.error(error.data.msg)
						}
					})
					.catch((error) => {
						message.error(error.data.msg)
					})
			}
			// if (roleTitle.value == "新增") {
			//   let result = await addRoleForm(roleForm);
			//   console.log(result, "新增请求结果");
			// }
			// if (roleTitle.value == "编辑") {
			//   let result = await updateRoleForm(roleForm);
			//   console.log(result, "编辑请求结果");
			// }
		}

		const cancelBtn = () => {
			//  return false
			roleRef.value.resetFields()
			roleVis.value = false
		}

		const sureBtn2 = () => {
			getRoleList(fiflterForm)
		}
		const cancelBtn2 = () => {
			//  return false
			roleRef2.value.resetFields()
			getRoleList(fiflterForm)
		}

		const getRoleList = async (fiflterForm: object) => {
			const result = await roleList(fiflterForm)
			roleData.value = result.data.data.records
			totalPage.value = result.data.data.total
			console.log(result.data.data.records, '2222222222222222')
		}

		const getRoleDetail = async (id: string) => {
			const result = await roleDetail({ id })
			console.log(result.data.data, '555555555555')
			console.log(roleForm, 'ppppppppp')
			// roleForm = result.data.data
			roleForm.code = result.data.data.code
			roleForm.status = result.data.data.status
			roleForm.name = result.data.data.name
		}

		const edit = (key: string) => {
			roleTitle.value = '编辑'
			console.log('key', key)
			roleForm.id = key
			roleVis.value = true
			getRoleDetail(key)
		}

		return {
			columns,
			roleData,
			rowSelection,
			labelCol: { style: { width: '70px' } },
			roleForm,
			roleRule,
			fiflterForm,

			roleVis,

			roleStatus,
			roleRef,
			roleRef2,

			currentPage,
			totalPage,
			roleTitle,
			getRoleDetail,
			onChange,

			getRoleList,

			addRole,
			sureBtn,
			cancelBtn,
			sureBtn2,
			cancelBtn2,
			showSizeChange,
			edit,
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
		margin-right: 20px;
	}
	.btn {
		margin: 0 5px;
	}
}
.pageination {
	margin-top: 25px;
	display: flex;
	justify-content: right;
}
.add_view {
	padding: 20px 0;
	.export_btn {
		margin-left: 30px;
		float: right;
	}
}
</style>
