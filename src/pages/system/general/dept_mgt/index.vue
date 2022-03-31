<template>
	<div>
		<div class="header">
			<a-select v-model:value="listParams.departmentName" style="width: 120px" placeholder="名称" allow-clear @change="handleChange">
				<a-select-option v-for="(item, index) in listParams.departmentList" :key="index" :value="item.name">
					{{ item.name }}
				</a-select-option>
			</a-select>
			<a-input-search
				v-model:value="listParams.inputValue"
				class="search_box"
				placeholder="请输入内容"
				style="width: 378px"
				@change="getInput"
				@search="onSearch"
			/>
			<a-button class="btn" type="primary" @click="queryData">查询</a-button>
			<a-button class="btn" @click="resetData">重置</a-button>
		</div>
		<div class="add_view">
			<a-button class="btn" type="primary" @click="showModal"
				><template #icon><PlusOutlined /></template>新增</a-button
			>
		</div>
		<div class="table_view">
			<a-table :columns="columns" :data-source="listParams.listData.records" :pagination="false">
				<template #isEnable="{ text: isEnable }">
					<a-tag :color="isEnable == 1 ? 'green' : 'volcano'">{{ isEnable == 1 ? '在用' : '停用' }}</a-tag>
				</template>
				<template #action="{ record }">
					<!--all rowData in record   -->
					<span>
						<a @click="editRow(record)">修改</a>
					</span>
				</template>
			</a-table>
		</div>
		<a-modal v-model:visible="visible" class="a_modal" :title="listParams.handle == 'write' ? '修改' : '新增'" @cancel="cancel" @ok="handleOk">
			<a-form ref="formRef" :rules="rules" :model="listParams" :label-col="labelCol" :wrapper-col="wrapperCol">
				<a-form-item label="编号" name="code">
					<a-input v-model:value="listParams.code" placeholder="请输入编号" />
				</a-form-item>
				<a-form-item label="名称" name="name">
					<a-input v-model:value="listParams.name" placeholder="请输入名称" />
				</a-form-item>
				<a-form-item label="状态" name="isEnable">
					<a-select v-model:value="listParams.isEnable" placeholder="请选择状态">
						<a-select-option value="1">在用</a-select-option>
						<a-select-option value="0">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="上级部门">
					<a-input class="a_input" value="" disabled placeholder="长安马自达总部" />
				</a-form-item>
			</a-form>
		</a-modal>
		<a-pagination
			size="small"
			:show-total="(total) => `共有 ${total} 条`"
			class="pagination"
			show-quick-jumper
			show-size-changer
			:current="listParams.current"
			:total="listParams.listData.total"
			@showSizeChange="onShowSizeChange"
			@change="pageChange"
		/>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { CodeRule } from '@/utils/role.js'
import { addDepartment, allDepartmentList, departmentList, queryDepartment, upDateDepartment } from '@/api/other'
const columns = [
	{
		dataIndex: 'code',
		key: 'code',
		title: '部门编号',
		align: 'center',
	},
	{
		title: '部门名称',
		dataIndex: 'name',
		key: 'name',
		align: 'center',
	},
	{
		title: '状态',
		dataIndex: 'isEnable',
		key: 'isEnable',
		align: 'center',
		slots: { customRender: 'isEnable' },
	},
	{
		title: '操作',
		key: 'action',
		dataIndex: 'action',
		align: 'center',
		slots: { customRender: 'action' },
	},
]
export default defineComponent({
	components: {
		PlusOutlined,
	},
	setup() {
		const formRef = ref(null)
		const rules = {
			name: [
				{ required: true, message: '请输入名称', trigger: 'blur' },
				{ required: true, min: 1, max: 40, message: '名称太长', trigger: 'change' },
			],
			code: CodeRule(),
			isEnable: [{ required: true, message: '请选择状态', trigger: 'change' }],
		}
		const search = ref<string>('')
		const visible = ref<boolean>(false)
		const listParams = reactive({
			size: 10,
			current: 1,
			code: '',
			name: '',
			isEnable: undefined,
			type: 1,
			id: '',
			handle: 'add', //  aad/write
			search: '',
			departmentName: undefined,
			inputValue: '',
			listData: {},
			departmentList: [],
		})
		const showModal = () => {
			visible.value = true
		}
		const handleOk = () => {
			formRef.value
				.validate()
				.then(() => {
					console.log(listParams.name)
					visible.value = false
					if (listParams.handle == 'add') {
						addDept()
					}
					if (listParams.handle == 'write') {
						updateDept()
					}
					listParams.name = ''
					listParams.code = ''
				})
				.catch((error: object) => {
					console.log('error', error)
				})
		}
		const cancel = () => {
			formRef.value.resetFields()
			listParams.handle = 'add'
		}
		const resetData = () => {
			listParams.name = ''
			listParams.search = ''
			listParams.inputValue = ''
			listParams.current = 1
			listParams.departmentName = undefined
			deptList()
			console.log(listParams.name)
		}
		const editRow = (e: object) => {
			visible.value = true
			listParams.handle = 'write'
			queryDepartment(e.code).then((res) => {
				const data = res.data.data
				listParams.code = data.code
				listParams.name = data.name
				listParams.id = data.id
				listParams.isEnable = data.isEnable.toString()
			})
			console.log(e)
		}
		const onShowSizeChange = (current: number, size: number) => {
			console.log(size)
			listParams.size = size
		}
		const handleChange = (e: object) => {
			listParams.inputValue = ''
			console.log(e)
		}
		const getInput = () => {
			listParams.departmentName = undefined
		}
		const pageChange = (event: number) => {
			listParams.current = event
			deptList()
			console.log(event)
		}
		const addDept = () => {
			const param = {
				code: listParams.code,
				name: listParams.name,
				isEnable: listParams.isEnable,
				type: 1,
			}
			addDepartment(param).then((res) => {
				if (res.data.data.message != 'success') {
					message.error(res.data.data.msg)
				} else {
					message.success('添加成功')
					deptList()
				}
			})
		}
		const updateDept = () => {
			const param = {
				code: listParams.code,
				name: listParams.name,
				isEnable: listParams.isEnable,
				id: listParams.id,
				// parentId:'',
				// dealerId:'',
				// type :1,
			}
			upDateDepartment(param)
				.then((res) => {
					if (res.data.data.msg == '系统异常') {
						message.error(res.data.data.msg)
					} else {
						message.success('修改成功！')
					}
					deptList()
				})
				// 没进到请求,才会返回catch 所以这里的catch 没有用
				.catch((error) => {
					message.error(error.data.msg)
				})
		}
		const deptList = () => {
			const params = {
				size: listParams.size,
				current: listParams.current,
				code: listParams.code,
				name: listParams.inputValue || listParams.departmentName,
				id: listParams.id,
			}
			departmentList(params).then((res) => {
				console.log(res)
				listParams.listData = res.data.data
			})
		}
		const allDeptList = () => {
			allDepartmentList().then((res) => {
				console.log(res.data.data)
				listParams.departmentList = res.data.data
			})
		}
		const onSearch = () => {
			deptList()
		}
		const queryData = () => {
			deptList()
		}
		onMounted(() => {
			deptList()
			allDeptList()
		})
		return {
			columns,
			search,
			visible,
			listParams,
			rules,
			formRef,
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
			getInput,
			onSearch,
			queryData,
			resetData,
			handleChange,
			onShowSizeChange,
			editRow,
			pageChange,
			showModal,
			handleOk,
			cancel,
		}
	},
})
</script>
<style lang="scss" scoped>
.header {
	padding-bottom: 17px;
	border-bottom: 1px solid #ebedf0;
	.search_box {
		margin-left: 1vw;
		width: 400px;
		margin-right: 25px;
	}
	.btn {
		margin: 0 5px;
	}
}
.add_view {
	padding: 20px 0;
}
.a_modal {
	.input_item {
		margin: 10px 0;
		overflow: hidden;
	}
	label {
		width: 20%;
		text-align: right;
		height: 32px;
		line-height: 32px;
		display: inline-block;
	}
	.a_input {
		float: right;
	}
}
.pagination {
	text-align: right;
	margin-top: 20px;
}
</style>
