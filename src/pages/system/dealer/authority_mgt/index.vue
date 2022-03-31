<template>
	<div>
		<div class="header">
			<a-form ref="searchRef" :model="search" class="flex flex-warp">
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="search.name" placeholder="姓名" style="width: 180px" />
				</a-form-item>
				<a-form-item name="code" class="search_box">
					<a-input v-model:value="search.code" placeholder="编号" style="width: 180px" />
				</a-form-item>
				<a-form-item name="mmsStatus" class="search_box">
					<a-select v-model:value="search.mmsStatus" placeholder="MMS运营状态" style="width: 180px" @change="handleChange">
						<a-select-option value="1"> 建设中</a-select-option>
						<a-select-option value="4"> 正常运营</a-select-option>
						<a-select-option value="7"> 预退网</a-select-option>
						<a-select-option value="9"> 已退网</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="accountStatus" class="search_box">
					<a-select v-model:value="search.accountStatus" placeholder="MMS账号状态" style="width: 180px" @change="handleChangeTow">
						<!-- <a-select-option
          v-for="val in departmentList"
          :key="val.code"
          :value="val.code"
          :label="val.name"
          >{{ val.name }}</a-select-option
        > -->
						<!-- 
            <a-select-option value="0"> 未授权</a-select-option> -->
						<a-select-option value="1">正常</a-select-option>
						<a-select-option value="9">停用</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="roleId" class="search_box">
					<a-select
						v-model:value="search.roleId"
						class="pick_view"
						placeholder="管理员角色"
						style="width: 128px"
						@change="handleChangeThree"
					>
						<a-select-option v-for="val in ReqVoList" :key="val.id" :value="val.id" :label="val.name">{{ val.name }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item>
					<a-button class="btn" type="primary" @click="getDealerList">查询</a-button>
					<a-button class="btn" @click="resetSearch">重置</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div>
			<div class="add_view">
				<a-button class="btn" @click="showModal">经销商管理员角色管理</a-button>
				<a-button class="export_btn" @click="exportExcel">
					<template #icon>
						<VerticalAlignBottomOutlined />
					</template>
					导出
				</a-button>
			</div>
		</div>
		<div style="margin-top: 30px">
			<a-table key="columns" :columns="columns" :data-source="dealerList" :pagination="false" :row-selection="rowSelection">
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
					:current="search.current"
					show-size-changer
					show-quick-jumper
					:page-size-options="['10', '20', '50', '100']"
					:show-total="(total) => `共有 ${total} 条`"
					@showSizeChange="showSizeChange"
					@change="change"
				/>
			</div>
		</div>

		<a-modal v-model:visible="visible" title="修改" width="1000px" @ok="handleOk" @cancel="cancelBtn">
			<a-form ref="formRef" :model="unpdateForm" :rules="roleRule" :label-col="labelCol">
				<a-row>
					<a-col :span="12">
						<a-form-item name="code" label="经销商编号">
							<a-input v-model:value="unpdateForm.code" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="name" label="经销商名称">
							<a-input v-model:value="unpdateForm.name" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-form-item name="fullName" label="经销商全称">
					<a-input v-model:value="unpdateForm.fullName" disabled />
				</a-form-item>
				<a-form-item name="address" label="经销商地址">
					<a-input v-model:value="unpdateForm.address" disabled />
				</a-form-item>
				<a-row>
					<a-col :span="12">
						<a-form-item name="openDate" label="开业日期">
							<a-input v-model:value="unpdateForm.openDate" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="dealerSize" label="规模">
							<a-input v-model:value="unpdateForm.dealerSize" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="saleManagerName" label="销售区域经理">
							<a-input v-model:value="unpdateForm.saleManagerName" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="serviceManagerName" label="售后区域经理">
							<a-input v-model:value="unpdateForm.serviceManagerName" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="bigAreaName" label="大区">
							<a-input v-model:value="unpdateForm.bigAreaName" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="dmsStatusName" label="DMS状态">
							<a-input v-model:value="unpdateForm.dmsStatusName" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="loginId" label="管理员账号">
							<a-input v-model:value="unpdateForm.loginId" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="dmsStatusName" label="MMS运营状态">
							<a-input v-model:value="unpdateForm.dmsStatusName" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="statusName" label="MMS账号状态">
							<a-select v-model:value="unpdateForm.statusName" placeholder="MMS账号状态" @change="handleChangeUp">
								<!-- <a-select-option
          v-for="val in departmentList"
          :key="val.code"
          :value="val.code"
          :label="val.name"
          >{{ val.name }}</a-select-option
        > -->

								<a-select-option value="1"> 正常</a-select-option>
								<a-select-option value="9"> 停用</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="roleName" label="管理员角色">
							<a-select v-model:value="unpdateForm.roleName" class="pick_view" placeholder="角色" @change="handleChangeUpTow">
								<a-select-option v-for="val in ReqVoList" :key="val.id" :value="val.id" :label="val.name">{{
									val.name
								}}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-modal>

		<a-modal v-model:visible="visibleTow" title="重置密码" width="560px" height="249px" @ok="handleOkTow">
			<a-alert message="确认要重置密码？" description="" type="warning" show-icon />
		</a-modal>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { RoleResetPassword, dealerRolDetail, dealerRolUpdate, dealerRoleList, getRoleReqVo } from '@/api/other'
const Form = () => ({
	accountStatus: '', // mms账号状态
	address: '', // 地址
	bigAreaName: '', // 大区名称
	code: '', // 编码
	dealerSize: '', // 规模
	dmsStatus: '', // 状态 1：建设中、2：建设中退出，3：已验收整改中，4：正常运营、5：黄牌，6：红牌、7：黑牌、8：退网中、9：已退网
	fullName: '', // 全称
	id: '', // 经销商ID
	loginId: '', // 管理员账号
	mmsStatus: '', // 状态 ：1-建设中、4-正常运营、7-预退网 、9-已退网
	name: '', // 名称
	openDate: '', // 开业日期
	roleId: '', // 角色ID
	roleIds: [], // 角色Id列表
	saleManagerName: '', // 销售经理名称
	serviceManagerName: '', // 售后服务经理名称
	updateTime: '', // 修改时间
	updateUserName: '', // 修改人
	userId: '', // 用户ID
})
const columns = [
	{
		title: '编号',
		dataIndex: 'code',
		key: 'code',
	},
	{
		title: '名称',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '全称',
		dataIndex: 'fullName',
		key: 'fullName',
	},
	{
		title: '大区',
		dataIndex: 'bigAreaName',
		key: 'bigAreaName',
	},
	{
		title: 'DMS状态',
		dataIndex: 'dmsStatusName',
		key: 'dmsStatusName',
	},
	{
		title: 'MMS运营状态',
		dataIndex: 'mmsStatusName',
		key: 'mmsStatusName',
	},
	{
		title: 'MMS账号状态',
		dataIndex: 'statusName',
		key: 'statusName',
	},
	{
		title: '管理员账号',
		dataIndex: 'loginId',
		key: 'loginId',
	},
	{
		title: '角色',
		dataIndex: 'roleName',
		key: 'roleName',
	},
	{
		title: '修改人',
		dataIndex: 'updateUserName',
		key: 'updateUserName',
	},
	{
		title: '修改时间',
		dataIndex: 'updateTime',
		key: 'updateTime',
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
	code: string | undefined
	accountStatus: number | undefined
	mmsStatus: number | undefined
	roleId: number | undefined
	size: number
	current: number
}
export default defineComponent({
	components: {
		PlusOutlined,
		VerticalAlignBottomOutlined,
	},
	setup() {
		const router = useRouter()
		const search = reactive<search>({
			name: undefined,
			code: undefined,
			accountStatus: undefined,
			mmsStatus: undefined,
			roleId: undefined,
			size: 10,
			current: 1,
		})
		onMounted(() => {
			getDealerList()
			getDownMenu()
		})
		// 获取列表
		const dealerList = ref([])
		const total = ref<number>(1)

		// 角色下拉菜单

		const ReqVoList = ref([])
		const getDealerList = () => {
			dealerRoleList(search).then(({ data }) => {
				console.log(data)
				total.value = data.data.total
				dealerList.value = data.data.records
			})
		}
		const getDownMenu = () => {
			getRoleReqVo(2).then(({ data }) => {
				ReqVoList.value = data.data
			})
		}
		// 重置
		const searchRef = ref(null)
		const resetSearch = () => {
			searchRef.value.resetFields()
			getDealerList()
			console.log(search)
		}
		// 复选框至详情
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
		// 跳转至角色管理
		const showModal = () => {
			// if (multipleSelection.value.length != 1) {
			//   message.warning("请选择一条经销商信息");
			// } else {
			router.push('/system/dealer/role_mgt')
			// message.success("跳转至角色管理");
			// }
		}
		// MMS运营状态
		const handleChange = (value: number) => {
			search.mmsStatus = value
			console.log(value)
		}
		// MMS账号状态
		const handleChangeTow = (value: number) => {
			search.accountStatus = value
			console.log(value)
		}
		// 管理员角色
		const handleChangeThree = (value: number) => {
			search.roleId = value
			console.log(value)
		}

		// 修改
		const formRef = ref(null)
		const roleRule = {
			statusName: [{ required: true, message: '请选择MMS账号状态', trigger: 'change' }],
			roleName: [{ required: true, message: '请选择管理员角色', trigger: 'change' }],
		}
		const visible = ref<boolean>(false)
		const unpdateForm = ref<object>()
		const modify = (res: object) => {
			dealerRolDetail(res.id).then(({ data }) => {
				console.log(data)
				visible.value = true
				unpdateForm.value = data.data
			})
		}
		const handleChangeUp = (value: number) => {
			unpdateForm.value.accountStatus = value
		}
		const handleChangeUpTow = (value: number) => {
			unpdateForm.value.roleId = value
			console.log(value)
		}
		const cancelBtn = () => {
			formRef.value.resetFields()
			visible.value = false
		}
		const handleOk = () => {
			formRef.value.validateFields().then(() => {
				dealerRolUpdate({
					id: unpdateForm.value.id,
					roleId: unpdateForm.value.roleId,
					accountStatus: unpdateForm.value.accountStatus,
				}).then(({ data }) => {
					visible.value = false
					if (data.message != 'success') {
						message.error(data.message)
					} else {
						message.success('修改成功！')
						getDealerList()
					}
				})
			})
		}
		// 重置密码
		const visibleTow = ref<boolean>(false)
		const resetPassword = (row: Object) => {
			unpdateForm.value = row
			visibleTow.value = true
		}
		const handleOkTow = () => {
			RoleResetPassword({ id: unpdateForm.value.id }).then(({ data }) => {
				if (data.data.message == 'success') {
					message.success('重置密码成功！')
				} else {
					message.error(data.data.message)
				}
			})
			visibleTow.value = false
			getList()
		}
		// 分页
		const showSizeChange = (current: number, size: number) => {
			search.current = current
			search.size = size
			getDealerList()
		}
		const change = (current: number, size: number) => {
			search.current = current
			search.size = size
			getDealerList()
		}
		return {
			columns,
			dealerList,
			ReqVoList,
			total,
			search,
			searchRef,
			rowSelection,
			visible,
			visibleTow,
			unpdateForm,
			roleRule,
			formRef,
			getDealerList,
			resetSearch,
			modify,
			showModal,
			cancelBtn,
			handleOk,
			handleOkTow,
			handleChange,
			handleChangeTow,
			handleChangeThree,
			handleChangeUp,
			handleChangeUpTow,
			showSizeChange,
			change,
			resetPassword,
			labelCol: { style: { width: '120px' } },
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
	.btn {
		float: left;
		border: 1px solid #1890ff;
		color: #1890ff;
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
