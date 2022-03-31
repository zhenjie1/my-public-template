<template>
	<div>
		<div class="header">
			<a-form ref="roleRef2" :model="fiflterForm" style="display: flex; flex-wrap: wrap">
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="fiflterForm.name" allow-clear placeholder="名称" />
				</a-form-item>

				<a-form-item name="code" class="search_box">
					<a-input v-model:value="fiflterForm.code" allow-clear placeholder="编号" />
				</a-form-item>
				<a-form-item name="status" class="search_box">
					<a-select
						ref="select"
						v-model:value="fiflterForm.isEnable"
						style="width: 180px"
						placeholder="状态"
						:options="roleStatus"
						allow-clear
					></a-select>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" @click.prevent="sureBtn2">查询</a-button>
					<a-button style="margin-left: 10px" @click="cancelBtn2">重置</a-button>
				</a-form-item>
			</a-form>
			<span style="display: flex">经销商：{{ ealerName.name }}</span>
		</div>
		<!-- <div class="add_view">
      <a-button type="primary" @click="addRole"
        ><template #icon><PlusOutlined /></template>新增</a-button
      >
      <a-button class="export_btn"
        ><template #icon><VerticalAlignBottomOutlined /></template
        >导出</a-button
      >
    </div> -->
		<div class="table_view">
			<a-table :columns="columns" :data-source="roleData" :row-selection="rowSelection" :pagination="false">
				<template #isEnable="{ text: isEnable }">
					<a-tag :color="isEnable == '0' ? 'volcano' : 'green'">{{ isEnable == '0' ? '停用' : '在用' }}</a-tag>
				</template>
				<template #action="{ record }">
					<!--all rowData in record   -->
					<span>
						<a @click="edit(record.id)">查看</a>
					</span>
				</template>
			</a-table>
			<div class="pageination">
				<a-pagination
					size="small"
					:current="fiflterForm.current"
					show-quick-jumper
					show-size-changer
					:show-total="(total) => `总共 ${totalPage} 条`"
					:total="totalPage"
					@change="onChange"
					@showSizeChange="showSizeChange"
				/>
			</div>
		</div>

		<a-modal v-model:visible="roleVis" centered :title="roleTitle" :dialog-class="baseVisible" @ok="sureBtn" @cancel="cancelBtn">
			<a-form ref="roleRef" :model="roleForm" label-align="right" :label-col="labelCol">
				<a-form-item required label="编号" name="code">
					<a-input v-model:value="roleForm.code" disabled placeholder="请输入编号" />
				</a-form-item>

				<a-form-item required label="名称" name="name">
					<a-input v-model:value="roleForm.name" disabled placeholder="请输入名称" />
				</a-form-item>

				<a-form-item required label="状态" name="status">
					<a-select
						ref="select"
						v-model:value="roleForm.status"
						disabled
						:options="roleStatus"
						placeholder="请选择状态"
						allow-clear
					></a-select>
				</a-form-item>
				<!-- <div class="titleTotal" style="margin-top: 10px; margin-bottom: 10px">
          <div class="titleLeft">分配权限</div>
        </div> -->
			</a-form>
		</a-modal>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { addRoleForm, dealerDeptMgt, dealerDetails, updateRoleForm } from '@/api/other'
const columns = [
	{
		dataIndex: 'code',
		key: 'code',
		title: '编号',
	},
	{
		title: '名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '状态',
		dataIndex: 'isEnable',
		key: 'isEnable',
		slots: { customRender: 'isEnable' },
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
	isEnable: number
	size: number
	current: number
	dealerId: any
}
interface roleForm {
	code: string
	status: string
	name: string
}

const roleStatus = [
	{ label: '在用', value: 1 },
	{ label: '停用', value: 0 },
]
const roleTitle = ref('新增')
const roleData = ref(null)
const ealerName = reactive({ name: null })
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
	},

	setup() {
		onMounted(() => {
			fiflterForm.dealerId = route.query.id
			ealerName.name = route.query.name
			getRoleList(fiflterForm)
			console.log('params', route.query)
		})
		const totalPage = ref<number>()
		const route = useRoute()
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
		// const roleRule = {
		//   code: [{ required: false, message: "请输入编号", trigger: "blur" }],
		//   name: [{ required: false, message: "请输入名称", trigger: "blur" }],
		//   status: [{ required: false, message: "请选择状态", trigger: "change" }],
		// };

		const roleForm = reactive<roleForm>({
			code: '',
			name: '',
			status: '',
		})
		const fiflterForm = reactive<fiflterForm>({
			code: '',
			name: '',
			status: '',
			size: 10,
			current: 1,
		})
		const addRole = () => {
			roleTitle.value = '新增'
			roleVis.value = true
		}

		const sureBtn = async () => {
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
			const result = await dealerDeptMgt(fiflterForm)
			roleData.value = result.data.data.records
			totalPage.value = result.data.data.total
			console.log(result.data.data.records, '2222222222222222')
		}

		const getRoleDetail = async (id: string) => {
			const result = await dealerDetails({ id })
			console.log(result.data.data, '555555555555')
			console.log(roleForm, 'ppppppppp')
			// roleForm = result.data.data
			roleForm.code = result.data.data.code
			roleForm.status = result.data.data.isEnable
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
			// roleRule,
			fiflterForm,

			roleVis,
			ealerName,
			roleStatus,
			roleRef,
			roleRef2,
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
	display: flex;
	justify-content: space-between;
	align-items: center;
	::v-deep .ant-form-item {
		margin-bottom: 0;
	}
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
