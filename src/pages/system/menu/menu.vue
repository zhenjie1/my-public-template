<template>
	<a-row class="menu" @click="closeOperationVis">
		<a-col :span="6" style="position: relative">
			<a-card class="menuTree">
				<div class="titleTotal" style="margin-bottom: 30px">
					<div class="titleLeft">菜单信息</div>
					<div class="titleRight">
						<PlusOutlined @click="addPingji" />
						<!-- <a-button type="primary" @click="bindCar"> 绑车 </a-button> -->
					</div>
				</div>
				<a-tree
					v-if="treeData.length"
					:show-icon="true"
					:tree-data="treeData"
					default-expand-all="true"
					@expand="onExpand"
					@rightClick="onRigClick"
					@select="selectClick"
				>
				</a-tree>
			</a-card>
			<div v-if="operationVis" class="operationVal">
				<a-button block @click="addChildren">添加子级</a-button>
				<a-button block @click="deleteSelf">删除</a-button>
			</div>
		</a-col>
		<a-col :span="18">
			<a-card class="menuForm">
				<a-empty v-if="!menuShow" :image="simpleImage">
					<template #description>
						<span> 请先在左侧进行添加 </span>
					</template>
				</a-empty>

				<a-form
					v-if="menuShow"
					ref="roleRef"
					:model="roleForm"
					:rules="roleRule"
					label-align="right"
					:label-col="labelCol"
					style="width: 80%"
				>
					<a-form-item label="资源类型" name="menuType">
						<a-radio-group v-model:value="roleForm.menuType" :options="menuTypeList" />
					</a-form-item>
					<div v-if="roleForm.menuType == 1 || roleForm.menuType == 2">
						<a-form-item label="父级前端名称" name="parentId">
							<a-select
								ref="select"
								v-model:value="roleForm.parentId"
								style="width: 180px"
								placeholder="请选择"
								:options="
									allNameList.map((item) => ({
										value: item.id,
										label: item.name,
									}))
								"
								allow-clear
								@change="parentNameChange"
							></a-select>
						</a-form-item>

						<a-form-item label="父级前端路由" name="parentComponent">
							<a-input
								v-model:value="roleForm.parentComponent"
								disabled="true"
								placeholder="请输入前端名称"
								show-count
								:maxlength="20"
							/>
						</a-form-item>
					</div>

					<a-form-item required label="前端名称" name="name">
						<a-input v-model:value="roleForm.name" placeholder="请输入前端名称" show-count :maxlength="20" />
					</a-form-item>

					<a-form-item label="前端路由" name="isRoute">
						<a-radio-group v-model:value="roleForm.isRoute" :options="isRouteList" />
						<a-form-item label="" name="url" style="margin-top: 24px; margin-bottom: -5px">
							<a-input v-model:value="roleForm.url" placeholder="请输入前端路由" />
						</a-form-item>
					</a-form-item>

					<a-form-item label="组件路径" name="component">
						<a-input v-model:value="roleForm.component" placeholder="请输入组件路径" />
					</a-form-item>

					<a-form-item required label="图标" name="icon">
						<a-input v-model:value="roleForm.icon" placeholder="请输入前端SVG" />
					</a-form-item>

					<a-form-item label="API接口" name="rsApiIds">
						<!-- <a-input
              v-model:value="roleForm.rsApiIds"
              placeholder="请输入API接口"
              @click="openApi"
            /> -->
						<a-select
							v-model:value="roleForm.rsApiIds"
							:open="false"
							mode="multiple"
							placeholder="请选择API接口"
							:options="
								apiSelect.map((item) => ({
									value: item.id,
									label: item.name,
								}))
							"
							@click="openApi"
						/>
					</a-form-item>

					<a-form-item label="排序值" name="sortOrder">
						<a-row>
							<a-col :span="8">
								<a-input v-model:value="roleForm.sortOrder" type="number" min="0" placeholder="请输入排序值" />
							</a-col>
							<a-col :span="12"> <span class="sortSpan">数值越小，排名越靠前</span></a-col>
						</a-row>
					</a-form-item>

					<a-form-item label="显示" name="isShow">
						<a-switch v-model:checked="roleForm.isShow" />
					</a-form-item>
					<a-form-item label="备注" name="remark">
						<a-textarea v-model:value="roleForm.remark" show-count :maxlength="200" />
					</a-form-item>

					<a-form-item style="margin-left: 120px">
						<a-button type="primary" @click="sureBtn">保存</a-button>
						<a-button style="margin-left: 10px" @click="cancelBtn">重置</a-button>
					</a-form-item>
				</a-form>
			</a-card>
		</a-col>

		<a-modal v-model:visible="apiVis" width="60%" title="选择api接口" wrap-class-name="baseVisible" @ok="okApi" @cancel="cancelApi">
			<a-input-search v-model:value="fiflterForm.name" placeholder="请输入API接口名称" style="margin-bottom: 20px" @change="onSearch" />

			<a-table :columns="columns" :data-source="menuData" :row-selection="rowSelection" :pagination="false" :show-header="false" />

			<div class="menuList pageination">
				<a-pagination
					v-model:current="currentPage"
					v-model:page-size="fiflterForm.size"
					size="small"
					show-quick-jumper
					show-size-changer
					:show-total="(total) => `总共 ${totalPage} 条`"
					:total="totalPage"
					@change="onChange"
				/>
			</div>
		</a-modal>
	</a-row>
</template>
<script lang="ts">
import { createVNode, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { CarryOutOutlined, DownOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Empty, Modal, message } from 'ant-design-vue'
import { allName, apiList, deleteMenu, menuDetail, menuTree, saveMenu, upDateMenu } from '@/api/other'
const columns = [
	{
		dataIndex: 'id',
		key: 'id',
	},
	{
		dataIndex: 'name',
		key: 'name',
	},
]

interface roleForm {}

const roleStatus = [
	{ label: '在用', value: '1' },
	{ label: '停用', value: '9' },
]
// 资源类型
const menuTypeList = [
	{ label: '菜单', value: 0 },
	{ label: '子菜单', value: 1 },
	{ label: '按钮权限', value: 2 },
]
// 前端路由
const isRouteList = [
	{ label: '内部', value: 0 },
	{ label: '外部', value: 1 },
]
// api筛选过滤
interface fiflterForm {
	size: number
	current: number
	name: string
}
export default defineComponent({
	components: {
		DownOutlined,
		CarryOutOutlined,
		PlusOutlined,
	},
	setup() {
		onMounted(() => {
			getMenuTree()
			getAllNameList()
		})

		const fiflterForm = reactive<fiflterForm>({
			size: 10,
			current: 1,
			name: '',
		})
		const parentId = ref()
		const menuShow = ref<boolean>(false) // 控制右边状态是空数据还是表单提交
		const apiVis = ref<boolean>(false) // 控制api搜索dialog框
		const addChildrenVis = ref<boolean>(false) // 通过这个状态判断是新增还是编辑
		const operationVis = ref<boolean>(false) // 控制新增删除的show和hide

		const apiSelect = ref([]) // api接口默认列表带的值
		const treeData = ref([])
		const selectedRowsRef = ref([]) // api接口选中集合
		const menuId = ref<string>('') // 菜单ID
		const getMenuTree = async () => {
			await menuTree().then((res) => {
				console.log('resssssss', res.data.data)
				treeData.value = res.data.data
			})
		}
		const closeOperationVis = () => {
			operationVis.value = false
		}
		//  const selectedRowKeysRef = ref([])
		const onExpand = (keys: string[]) => {
			expandedKeys.value = keys
			//  autoExpandParent.value = false;
			console.log('8888888888888888', keys)
		}

		const roleRef = ref(null)

		const checkRoute = (rule, value, callback) => {
			if (value) {
				if (/[\u4E00-\u9FA5]/g.test(value)) {
					return Promise.reject(new Error('请输入符合规范的路由'))
				} else {
					return Promise.resolve()
				}
			} else {
				return Promise.reject(new Error('请输入符合规范的路由'))
			}
		}
		const checkComponent = (rule, value, callback) => {
			if (value) {
				if (/[\u4E00-\u9FA5]/g.test(value)) {
					return Promise.reject(new Error('请输入符合规范的路由'))
				} else {
					return Promise.resolve()
				}
			}
		}
		const checkIcon = (rule, value, callback) => {
			if (!value) {
				return Promise.reject(new Error('请输入符合规范的路由'))
			}
			if (/[\u4E00-\u9FA5]/g.test(value)) {
				return Promise.reject(new Error('请输入符合规范的路由'))
			} else {
				return Promise.resolve()
			}
		}
		const roleRule = {
			// menuType: [
			//   { required: true, message: "请选择资源类型", trigger: "change" },
			// ],
			name: [{ required: true, message: '请输入前端名称', trigger: 'blur' }],
			url: [{ validator: checkRoute, trigger: 'blur' }],
			component: [{ validator: checkComponent, trigger: 'blur' }],
			icon: [{ required: true, validator: checkIcon, trigger: 'blur' }],
			// code: [{ required: true, message: "请输入编号", trigger: "blur" }],
			// status: [{ required: true, message: "请选择状态", trigger: "change" }],
		}

		const roleForm = ref<roleForm>({
			menuType: 0,
			name: '',
			isRoute: 0,
			component: '',
			url: '',
			icon: '',
			rsApiIds: undefined,
			sortOrder: null,
			isShow: null,
			remark: '',

			parentId: '',

			isExternal: '',
		})
		const allNameList = ref([])
		// 按保存的时候
		const sureBtn = async () => {
			console.log('addChildrenVis', addChildrenVis.value)

			roleRef.value.validateFields().then(() => {
				if (roleForm.value.isShow == false) {
					roleForm.value.isShow = 0
				} else {
					roleForm.value.isShow = 1
				}
				if (addChildrenVis.value == false) {
					roleForm.value.id = menuId.value
					if (roleForm.value.menuType == 0) {
						roleForm.value.pId = 0
					}
					// 编辑菜单
					upDateMenu(roleForm.value)
						.then((res) => {
							console.log('res111111111111111', res.data.data)

							if (res.data.message == 'success') {
								getMenuTree()
								message.success(res.data.message)
								roleRef.value.resetFields()
							} else {
								message.error(res.data.message)
							}
						})
						.catch((error) => {
							message.error(error.data.msg)
						})
				} else {
					if (roleForm.value.menuType == 0) {
						roleForm.value.pId = 0
					} else {
						roleForm.value.pId = parentId.value
					}
					roleForm.value.id = menuId.value

					// 新增菜单
					saveMenu(roleForm.value)
						.then((res) => {
							console.log('res111111111111111', res.data.data)

							if (res.data.message == 'success') {
								getMenuTree()
								message.success(res.data.message)
								roleRef.value.resetFields()
							} else {
								message.error(res.data.message)
							}
						})
						.catch((error) => {
							message.error(error.data.msg)
						})
				}
			})
		}
		// 新增平级
		const addPingji = () => {
			if (roleRef.value) {
				roleRef.value.resetFields()
			}
			menuShow.value = true
			addChildrenVis.value = true
		}
		// 重置
		const cancelBtn = () => {
			//  return false
			roleRef.value.resetFields()
		}
		// 父级前端的列表select
		const getAllNameList = async () => {
			await allName().then((res) => {
				console.log('allName', res.data.data)
				allNameList.value = res.data.data
			})
		}
		// 菜单右击
		const onRigClick = async ({ event, node }) => {
			console.log('nodeObject', { event, node })
			console.log('aaaaaa', node.dataRef)

			menuId.value = node.dataRef.id
			operationVis.value = true
			parentId.value = node.dataRef.pId
			// console.log()
		}
		// 菜单详情
		const postMenuDetail = async (id: string) => {
			await menuDetail({ id }).then((res) => {
				menuId.value = id
				console.log('danji', res.data.data)
				roleForm.value = res.data.data
				if (res.data.data.respurceList) {
					apiSelect.value = res.data.data.respurceList
				} else {
					apiSelect.value = []
				}

				if (roleForm.value.rsApiIds) {
					roleForm.value.rsApiIds.split(',')
				} else {
					roleForm.value.rsApiIds = undefined
				}

				if (res.data.data.isShow == 0) {
					roleForm.value.isShow = false
				} else {
					roleForm.value.isShow = true
				}
			})
		}
		// 惨淡单击
		const selectClick = async (selectedKeys, selectedNodes) => {
			if (roleRef.value) {
				roleRef.value.resetFields()
			}
			menuShow.value = true
			operationVis.value = false
			addChildrenVis.value = false
			console.log('单机', selectedKeys, selectedNodes.node.dataRef)
			postMenuDetail(selectedNodes.node.dataRef.id)
		}

		const addChildren = () => {
			if (roleRef.value) {
				roleRef.value.resetFields()
			}
			menuShow.value = true
			addChildrenVis.value = true
			operationVis.value = false
			roleForm.value.menuType = 1
		}
		// 删除
		const deleteSelf = () => {
			Modal.confirm({
				title: () => '你确定要删除菜单节点吗',
				icon: () => createVNode(ExclamationCircleOutlined),
				content: () => '',
				okText: () => 'Yes',
				okType: 'danger',
				cancelText: () => 'No',
				async onOk() {
					await deleteMenu(menuId.value)
						.then((res) => {
							console.log('delete', res.data.data)

							if (res.data.message == 'success') {
								getMenuTree()
								message.success(res.data.message)
								operationVis.value = false
							} else {
								message.error(res.data.message)
							}
						})
						.catch((error) => {
							message.error(error.data.msg)
						})
				},
				onCancel() {
					operationVis.value = false
				},
			})
		}
		const openApi = () => {
			console.log(roleForm.value, '666666666666666')
			getapiList(fiflterForm)
			apiVis.value = true
		}

		const okApi = () => {
			if (selectedRowsRef.value.length > 0) {
				const totalApiList = selectedRowsRef.value.concat(apiSelect.value)
				apiSelect.value = unique(totalApiList)

				const rsApiIds_list = apiSelect.value.map((item) => item.id)
				console.log('selectedRows', rsApiIds_list)
				roleForm.value.rsApiIds = rsApiIds_list
				apiVis.value = false
			} else {
				message.warning('暂未选中任何一个选项')
			}
		}

		const unique = (arr) => {
			const res = new Map()
			return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
		}

		const cancelApi = () => {}
		const parentNameChange = async () => {
			console.log('roleForm.parentId', roleForm.value.parentId)

			await menuDetail({ id: roleForm.value.parentId }).then((res) => {
				// menuId.value = roleForm.value.parentId;
				// console.log("danji", res.data.data);
				roleForm.value.parentComponent = res.data.data.component
			})
		}
		// 表格选中事件
		const rowSelection = {
			onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
				console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
				selectedRowsRef.value = selectedRows
				// selectedRowKeysRef.value = selectedRowKeys
			},
			onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
				console.log(record, selected, selectedRows)
			},
			onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
				console.log(selected, selectedRows, changeRows)
			},
		}

		const currentPage = ref<number>(1)
		const totalPage = ref<number>()

		const menuData = ref(null)
		const getapiList = async (fiflterForm: object) => {
			const result = await apiList(fiflterForm)
			menuData.value = result.data.data.records
			totalPage.value = result.data.data.total
			console.log(result.data.data, '2222222222222222')
		}
		const onSearch = () => {
			getapiList(fiflterForm)
		}
		const expandedKeys = ref<string[]>()

		watch(expandedKeys, () => {
			console.log('expandedKeys', expandedKeys)
		})
		return {
			addChildrenVis,
			menuShow,
			simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
			selectedRowsRef,
			parentId,
			apiSelect,
			columns,
			expandedKeys,
			// autoExpandParent,
			treeData,

			labelCol: { style: { width: '120px' } },
			apiVis,
			menuData,
			totalPage,
			fiflterForm,
			currentPage,
			operationVis,
			allNameList,
			roleForm,
			roleStatus,
			menuTypeList,
			isRouteList,
			roleRef,
			roleRule,
			rowSelection,
			addPingji,
			closeOperationVis,
			onExpand,
			onRigClick,
			addChildren,
			deleteSelf,
			sureBtn,
			cancelBtn,
			selectClick,
			getAllNameList,
			openApi,
			okApi,
			cancelApi,
			parentNameChange,
			onSearch,
		}
	},
})
</script>
<style lang="scss" scoped>
.menu {
	.menuTree {
		height: 70vh;
	}
	.operationVal {
		width: 100px;
		height: 40px;
		position: absolute;
		right: 20px;
		top: 200px;
	}
	.menuForm {
		height: 70vh;
		margin-left: 17px;
		.sortSpan {
			font-size: 12px;
			margin-left: 8px;
			line-height: 30px;
			color: #c8c9cc;
		}
	}
}
</style>
<style>
.menuList.pageination .ant-pagination {
	margin-top: 25px;
	display: flex;
	justify-content: right;
}
</style>
