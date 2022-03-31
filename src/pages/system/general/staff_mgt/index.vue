<template>
	<div>
		<div class="header">
			<a-form ref="searchRef" :model="search" class="flex flex-warp">
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="search.name" class="search_box" placeholder="姓名" style="width: 180px" allow-clear />
				</a-form-item>
				<a-form-item name="status" class="search_box">
					<a-select
						v-model:value="search.status"
						class="pick_view"
						placeholder="状态"
						style="width: 128px"
						allow-clear
						@change="handleChange"
					>
						<a-select-option value="0"> 未授权</a-select-option>
						<a-select-option value="1"> 在用</a-select-option>
						<a-select-option value="9"> 停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="deptCode" class="search_box">
					<a-select
						v-model:value="search.deptCode"
						class="pick_view"
						placeholder="部门"
						style="width: 128px"
						allow-clear
						@change="handleChangeTow"
					>
						<a-select-option v-for="(val, index) in departmentList" :key="index + val.code" :value="val.code" :label="val.name">{{
							val.name
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="roleCode" class="search_box">
					<a-select
						v-model:value="search.roleCode"
						class="pick_view"
						placeholder="角色"
						style="width: 128px"
						allow-clear
						@change="handleChangeThree"
					>
						<a-select-option v-for="(val, index) in ReqVoList" :key="index + val.code" :value="val.code" :label="val.name">{{
							val.name
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item>
					<a-button class="btn" type="primary" @click="getList">查询</a-button>
					<a-button class="btn" @click="reset">重置</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div class="add_view">
			<!-- <a-button type="primary"><template #icon><PlusOutlined /></template>新增</a-button> -->
			<a-button class="export_btn" @click="exportExcel">
				<template #icon>
					<VerticalAlignBottomOutlined />
				</template>
				导出
			</a-button>
		</div>

		<div class="table_view" style="margin-top: 30px">
			<a-table key="columns" :columns="columns" :data-source="dataList" :pagination="false" :row-selection="rowSelection">
				<template #status="{ record }">
					<a-tag v-if="record.status == '0'" color="red"> 未授权</a-tag>
					<a-tag v-if="record.status == '1'" color="green"> 在用</a-tag>
					<a-tag v-if="record.status == '9'" color="volcano"> 停用</a-tag>
				</template>
				<template #action="{ record }">
					<span>
						<a href="javascript:;" @click="modify(record)">修改</a>
						<a href="javascript:;" style="margin-left: 10px" @click="resetPassword(record)">重置密码</a>
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
			<a-modal v-model:visible="visible" title="修改" width="560px" cancel-text="取消" ok-text="确认" @ok="handleOk" @cancel="cancelBtn">
				<div>
					<div class="form-title">个人信息</div>
				</div>
				<a-form ref="roleRef" :label-col="labelCol" :rules="roleRule" :model="updateForm">
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
							<a-form-item label="办公电话" label-align="right">
								<a-input v-model:value="updateForm.officephone" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="Email" label-align="right">
								<a-input v-model:value="updateForm.email" disabled />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="12">
							<a-form-item label="账号" label-align="right">
								<a-input v-model:value="updateForm.code" disabled />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="手机号码" label-align="right" name="mobilephone">
								<a-input v-model:value="updateForm.mobilephone" />
							</a-form-item>
						</a-col>
					</a-row>
					<div>
						<div class="form-title">管理信息</div>
					</div>
					<a-row>
						<a-col :span="12">
							<a-form-item label="部门" label-align="right" name="deptName">
								<a-select v-model:value="updateForm.deptName" default-value="部门" @change="uphandleChangeTow">
									<a-select-option
										v-for="(val, index) in departmentList"
										:key="index + val.code"
										:value="val.code"
										:label="val.name"
										>{{ val.name }}</a-select-option
									>
								</a-select>
							</a-form-item>
						</a-col>

						<a-col :span="12">
							<a-form-item label="状态" label-align="right" name="statusName">
								<a-select v-model:value="updateForm.statusName" placeholder="状态" @change="uphandleChange">
									<a-select-option value="0"> 未授权</a-select-option>
									<a-select-option value="1"> 在用</a-select-option>
									<a-select-option value="9"> 停用</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
					</a-row>
					<a-col :span="12">
						<a-form-item label="角色" label-align="right" name="roleName" prop="roleName">
							<a-select v-model:value="updateForm.roleName" placeholder="角色" @change="uphandleChangeThree">
								<a-select-option v-for="(val, index) in ReqVoList" :key="index + val.code" :value="val.code" :label="val.name">{{
									val.name
								}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-form>
			</a-modal>
			<div></div>
			<a-modal v-model:visible="visibleTow" title="重置密码" width="560px" height="249px" @ok="handleOkTow">
				<a-alert message="确认要重置密码？" description="" type="warning" show-icon />
			</a-modal>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { phoneRule } from '@/utils/role.js'
import { RoleResetPassword, getRoleDepartment, getRoleDetail, getRoleExcel, getRoleList, getRoleReqVo, getRoleUpdate } from '@/api/other'

const columns = [
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
interface search {
	name: string | undefined
	status: string | undefined
	deptCode: string | undefined
	roleCode: string | undefined
	size: number
	current: number
	type: number
}

export default defineComponent({
	components: {
		PlusOutlined,
		VerticalAlignBottomOutlined,
	},
	setup() {
		onMounted(() => {
			getList()
			getDropDownList()
		})
		// 查询 -- 列表 --  -- 总条数
		const search = ref<search>({
			current: 1,
			size: 10,
			name: undefined, // 姓名 ,
			status: undefined, // 状态：0-未授权、1-在用 、9-停用 ,
			deptCode: undefined, // 部门编码 ,
			roleCode: undefined, // 角色编码 ,
			type: 1, // 类型：1-总部 2-经销商 3-经销商管理员
		})
		const dataList = ref([])
		const total = ref<any>()

		const getList = () => {
			getRoleList(search.value).then(({ data }) => {
				dataList.value = data.data.records
				total.value = data.data.total
			})
		}
		// (部门,角色)下拉菜单
		const departmentList = ref([])
		const ReqVoList = ref([])
		const getDropDownList = () => {
			// 部门下拉列表
			getRoleDepartment(1).then(({ data }) => {
				departmentList.value = data.data
			})
			// 角色下拉列表
			getRoleReqVo(1).then(({ data }) => {
				ReqVoList.value = data.data
			})
		}
		// 下拉列表
		const handleChange = (value: number) => {
			search.value.status = value
			console.log(value)
		}
		const handleChangeTow = (value: number) => {
			search.value.deptCode = value
			console.log(value)
		}
		const handleChangeThree = (index: number) => {
			search.value.roleCode = index
			console.log(index)
		}

		// 导出
		const exportExcel = () => {
			getRoleExcel({ type: 1 })
				.then((res) => {
					const link = document.createElement('a')
					const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
					link.style.display = 'none'
					// 设置连接
					link.href = URL.createObjectURL(blob)
					link.download = '自定义文件名'
					document.body.appendChild(link)
					// 模拟点击事件
					link.click()
				})
				.catch((err) => {
					console.warn(err)
				})
		}
		// 重置
		const searchRef = ref(null)
		const reset = () => {
			searchRef.value.resetFields()
			getList()
		}

		// 修改
		const visible = ref<boolean>(false)
		const updateForm = ref<object>()
		const modify = (row: Object) => {
			getRoleDetail({ id: row.id }).then(({ data }) => {
				updateForm.value = data.data
				visible.value = true
			})
		}
		const roleRef = ref(null)
		const roleRule = {
			mobilephone: phoneRule(),
			deptName: [{ required: true, message: '请选择部门', trigger: 'change' }],
			roleName: [{ required: true, message: '请选择角色', trigger: 'change' }],
			statusName: [{ required: true, message: '请选择状态', trigger: 'change' }],
		}
		const uphandleChange = (value: number) => {
			updateForm.value.status = value
			console.log(value)
		}
		const uphandleChangeTow = (value: number) => {
			updateForm.value.deptCode = value
			console.log(value)
		}
		const uphandleChangeThree = (index: number) => {
			updateForm.value.roleCode = index
			console.log(index)
		}
		const handleOk = () => {
			roleRef.value.validateFields().then(() => {
				getRoleUpdate({
					deptCode: updateForm.value.deptCode,
					id: updateForm.value.id,
					mobilephone: updateForm.value.mobilephone,
					roleCode: updateForm.value.roleCode,
					status: updateForm.value.status,
					type: updateForm.value.type,
				}).then(({ data }) => {
					console.log(data.msg)
					if (data.msg == '系统异常') {
						message.error(data.msg)
					} else {
						message.success('修改成功！')
					}
					visible.value = false
					getList()
				})
			})
		}

		// 重置密码
		const visibleTow = ref<boolean>(false)
		const resetPassword = (row: Object) => {
			updateForm.value = row
			visibleTow.value = true
		}
		const handleOkTow = () => {
			RoleResetPassword({ id: updateForm.value.id }).then(({ data }) => {
				if (data.data.message == 'success') {
					message.success('重置密码成功！')
				} else {
					message.error(data.data.message)
				}
			})
			visibleTow.value = false
			getList()
		}
		// 取消按钮
		const cancelBtn = () => {
			updateForm.value = []
			roleRef.value.resetFields()
			visible.value = false
		}
		// 复选框
		const multipleSelection = ref([])
		const rowSelection = {
			onChange: (selectedRowKeys: (string | number)[], selectedRows: []) => {
				const arr: [] = []
				selectedRows.map((item) => {
					arr.push(item.code)
				})
				multipleSelection.value = arr
				console.log(multipleSelection.value)
			},
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
			searchRef,
			dataList,
			departmentList,
			ReqVoList,
			total,
			visible,
			visibleTow,
			updateForm,
			roleRef,
			roleRule,

			//  fun
			getList,
			getDropDownList,
			handleChange,
			handleChangeTow,
			handleChangeThree,
			uphandleChange,
			uphandleChangeTow,
			uphandleChangeThree,
			exportExcel,
			reset,
			resetPassword,
			handleOk,
			cancelBtn,
			handleOkTow,
			modify,
			showSizeChange,
			change,
			rowSelection,
			labelCol: { style: { width: '80px' } },
			labelColTow: { style: { width: '90px' } },
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
