<template>
	<div>
		<div class="header">
			<a-form ref="searchRef" :model="searchObj" class="flex flex-warp">
				<a-form-item name="name" class="search_box">
					<a-input v-model:value="searchObj.name" placeholder="姓名" style="width: 180px" />
				</a-form-item>
				<a-form-item name="code" class="search_box">
					<a-input v-model:value="searchObj.code" placeholder="编号" style="width: 180px" />
				</a-form-item>
				<!-- <a-form-item name="name" class="search_box">
          <a-select
            class="pick_view"
            placeholder="区域"
            style="width: 128px"
            @change="handleChangeThree"
            v-model:value="search.roleId"
          >
          </a-select>
        </a-form-item> -->
				<a-form-item name="dmsStatus" class="search_box">
					<a-select v-model:value="searchObj.dmsStatus" placeholder="DMS状态" style="width: 180px" @change="handleChange">
						<a-select-option v-for="(item, index) in allDmsStatus" :key="index" :value="item.value"> {{ item.name }}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item name="accountStatus" class="search_box">
					<a-select v-model:value="searchObj.mmsStatus" placeholder="MMS运营状态" style="width: 180px" @change="handleChange">
						<a-select-option v-for="(item, index) in accountStatus" :key="index" :value="item.value"> {{ item.name }}</a-select-option>
					</a-select>
				</a-form-item>
				<!-- <a-form-item name="mmsStatus" class="search_box">
          <a-select
            placeholder="MMS账号状态"
            style="width: 180px"
            @change="handleChangeTow"
            v-model:value="searchObj.accountStatus"
          > -->
				<!-- <a-select-option
          v-for="val in departmentList"
          :key="val.code"
          :value="val.code"
          :label="val.name"
          >{{ val.name }}</a-select-option
        > -->
				<!-- <a-select-option value="0"> 未授权</a-select-option>
            <a-select-option value="1"> 在用</a-select-option>
            <a-select-option value="9"> 已推广</a-select-option>
          </a-select>
        </a-form-item> -->
				<a-form-item>
					<a-button class="btn" type="primary" @click="getDealerList">查询</a-button>
					<a-button class="btn" @click="resetSearch">重置</a-button>
				</a-form-item>
			</a-form>
		</div>
		<div style="margin-top: 30px">
			<a-table key="columns" :columns="columns" :data-source="dealer_List" :pagination="false" :scroll="{ x: '85vw' }">
				<template #name="{ text: name }">
					<a>{{ name }} </a>
				</template>
				<template #action="{ record }">
					<a class="action_btn" @click="modify(record)">修改</a>
					<a class="action_btn" @click="link_page(record, 1)">部门管理</a>
					<a class="action_btn" @click="link_page(record, 2)">员工管理</a>
					<a-dropdown-button class="dropdown_button" @click="handleButtonClick">
						<template #overlay>
							<a-menu @click="handleMenuClick">
								<a-menu-item key="1">预退网设置</a-menu-item>
								<a-menu-item key="2">经销商退网</a-menu-item>
							</a-menu>
						</template>
					</a-dropdown-button>
				</template>
			</a-table>
			<div style="display: flex; justify-content: flex-end; margin-top: 20px">
				<a-pagination
					:total="searchObj.total"
					size="small"
					show-size-changer
					show-quick-jumper
					:current="searchObj.current"
					:page-size-options="['10', '20', '50', '100']"
					:show-total="(total) => `共有 ${total} 条`"
					@showSizeChange="showSizeChange"
					@change="pageChange"
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
						<a-form-item name="dcrcPhone" label="DCRC热线">
							<a-input v-model:value="unpdateForm.dcrcPhone" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="rescuePhone" label="24小时救援热线">
							<a-input v-model:value="unpdateForm.rescuePhone" disabled />
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
						<a-form-item name="dmsStatus" label="DMS状态">
							<a-input v-model:value="unpdateForm.dmsStatus" disabled />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="saleManagerName" label="销售区域经理">
							<!-- <a-input v-model:value="unpdateForm.saleManagerName"  /> -->
							<a-select v-model:value="unpdateForm.saleManagerId" placeholder="销售区域经理" @change="handleChange">
								<a-select-option v-for="(item, index) in searchObj.mgrList" :key="index" :value="item.id">
									{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item name="serviceManagerName" label="售后区域经理">
							<!-- <a-input v-model:value="unpdateForm.serviceManagerName" /> -->
							<a-select v-model:value="unpdateForm.serviceManagerId" placeholder="售后区域经理" @change="handleChange">
								<a-select-option v-for="(item, index) in searchObj.mgrList" :key="index" :value="item.id">
									{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12">
						<a-form-item name="mmsStatus" label="MMS运营状态">
							<a-select placeholder="请选择MMS运营状态" :value="unpdateForm.mmsStatus" @change="handleChangeTow">
								<!-- <a-select-option
                  v-for="val in departmentList"
                  :key="val.code"
                  :value="val.code"
                  :label="val.name"
                  >{{ val.name }}</a-select-option
                > -->
								<a-select-option v-for="(item, index) in accountStatus" :key="index" v-model:value="item.value">
									{{ item.name }}</a-select-option
								>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- <a-col :span="12">
            <a-form-item name="roleId" label="管理员角色">
              <a-input v-model:value="unpdateForm.roleId" />
            </a-form-item>
          </a-col> -->
				</a-row>
			</a-form>
		</a-modal>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { changeManager, dealerList, dealerRowDetails, managerList } from '@/api/other'

const columns = [
	{
		title: '编号',
		dataIndex: 'code',
		width: 120,
		fixed: 'left',
		key: 'code',
	},
	{
		title: '名称',
		dataIndex: 'name',
		width: 100,
		fixed: 'left',
		slots: { customRender: 'name' },
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
		title: '销售区域经理',
		dataIndex: 'saleManagerName',
		key: 'saleManagerName',
	},
	{
		title: '操作',
		key: 'action',
		width: 260,
		fixed: 'right',
		dataIndex: 'action',
		slots: { customRender: 'action' },
	},
]
interface search {
	name: string | undefined
	code: string | undefined
	accountStatus: number | undefined
	mmsStatus: number | undefined
	dmsStatus: number | undefined
	roleId: number | undefined
	size: number
	current: string | undefined
	total: string | undefined
	type: number
	mgrList: undefined
	id: undefined
}
export default defineComponent({
	setup() {
		const router = useRouter()
		const searchObj = reactive<search>({
			name: undefined,
			code: undefined,
			accountStatus: undefined,
			mmsStatus: undefined,
			dmsStatus: undefined,
			roleId: undefined,
			size: 10,
			current: '1',
			total: undefined,
			type: 1,
			mgrList: undefined,
			id: undefined,
		})
		onMounted(() => {
			getDealerList()
			queryManagerList()
		})
		const allDmsStatus = ref([
			{ value: '1', name: '建设中' },
			{ value: '2', name: '建设中退出' },
			{ value: '4', name: '正常运营' },
			{ value: '5', name: '黄牌' },
			{ value: '5', name: '黄牌' },
			{ value: '6', name: '红牌' },
			{ value: '7', name: '黑牌' },
			{ value: '8', name: '退网中' },
			{ value: '9', name: '已退网' },
		])
		const accountStatus = ref([
			{ value: '1', name: '建设中' },
			{ value: '4', name: '正常运营' },
			{ value: '7', name: '预退网' },
			{ value: '9', name: '已退网' },
		])
		const dealer_List = ref([])
		const getDealerList = () => {
			dealerList(searchObj).then((res) => {
				console.log(res.data.data.records)
				dealer_List.value = res.data.data.records
				// searchObj.current=res.data.data.current
				searchObj.total = res.data.data.total
			})
		}
		const roleRule = {
			mmsStatus: [{ required: true, message: '请选择MMS运营状态', trigger: 'change' }],
			serviceManagerName: [{ required: true, message: '请选择售后区域经理', trigger: 'change' }],
			saleManagerName: [{ required: true, message: '请选择销售区域经理', trigger: 'change' }],
		}
		const searchRef = ref(null)
		const resetSearch = () => {
			searchRef.value.resetFields()
			getDealerList()
			console.log(searchObj)
		}
		const showSizeChange = (current: number, size: number) => {
			console.log(size)
			searchObj.size = size
			getDealerList()
		}
		const pageChange = (e: string) => {
			console.log(e)
			searchObj.current = e
			getDealerList()
		}
		const visible = ref<boolean>(false)
		const unpdateForm = ref<object>()
		const modify = (res: object) => {
			dealerRowDetails(res.id).then(({ data }) => {
				visible.value = true
				unpdateForm.value = data.data
				searchObj.id = res.id
			})
		}
		const queryManagerList = () => {
			managerList(searchObj.type).then((res) => {
				console.log(res.data.data)
				searchObj.mgrList = res.data.data
			})
		}
		const formRef = ref()
		const handleOk = () => {
			formRef.value
				.validate()
				.then(() => {
					visible.value = false
					changeManagerData()
				})
				.catch((error: object) => {
					console.log('error', error)
				})
		}
		const changeManagerData = () => {
			const params = {
				mmsStatus: unpdateForm.value.mmsStatus,
				saleManagerId: unpdateForm.value.saleManagerId,
				serviceManagerId: unpdateForm.value.serviceManagerId,
				id: searchObj.id,
			}
			// console.log(params);
			// return
			changeManager(params).then((res) => {
				if (res.data.data.message == 'success') {
					message.success('修改成功')
					getDealerList()
				} else {
					message.error(res.data.data.msg)
				}
			})
		}
		const link_page = (data: object, type: number) => {
			if (type == 1) {
				router.push({ path: '/system/dealer/dept_mgt', query: { id: data.id, name: data.name } })
			}
			if (type == 2) {
				router.push({ path: '/system/dealer/staff_mgt', query: { id: data.id, name: data.name } })
			}
		}
		const handleChange = () => {}
		const handleChangeTow = (e: any) => {
			console.log(e)
			unpdateForm.value.mmsStatus = e.toString()
		}
		return {
			columns,
			visible,
			dealer_List,
			searchObj,
			searchRef,
			unpdateForm,
			roleRule,
			accountStatus,
			formRef,
			allDmsStatus,
			labelCol: { style: { width: '120px' } },
			link_page,
			handleOk,
			modify,
			pageChange,
			showSizeChange,
			getDealerList,
			resetSearch,
			handleChange,
			handleChangeTow,
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
	padding: 20px 0 0;

	.btn {
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
.action_btn {
	margin-right: 10px;
}
::v-deep .dropdown_button .ant-btn {
	padding: 0;
	border: 0 solid transparent;
	background: transparent;
	height: auto;
	.anticon-ellipsis {
		height: 9px;
		overflow: hidden;
	}
}
</style>
