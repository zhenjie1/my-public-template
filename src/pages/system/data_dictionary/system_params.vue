<route lang="yaml">
meta:
    title: 系统参数
</route>

<template>
	<div class="journal">
		<a-row>
			<a-col :span="5">
				<a-card>
					<a-input-search v-model:value="search" style="margin-bottom: 8px" placeholder="请输入关键词" @search="seachChange" />
					<div class="table">
						<a-radio-group v-model:value="value" class="table" button-style="solid" @change="radioChange">
							<a-radio-button v-for="item of 10" :key="item" style="width: 100%" :value="item"
								><div style="margin-left: 20px">{{ item }}</div></a-radio-button
							>
						</a-radio-group>
					</div>
				</a-card>
			</a-col>
			<a-col :span="19">
				<a-card>
					<div class="journalList">
						<div class="flex flex-end borderbottom">
							<a-input v-model:value="searchValue" class="mr10 input" placeholder="请输入名称或者编码" allow-clear />
							<a-button class="btn mr10" type="primary" @click="getList">查询</a-button>
							<a-button class="btn mr10" @click="reset">重置</a-button>
						</div>
					</div>
					<div style="margin-top: 30px">
						<a-table key="columns" :columns="columns" :data-source="journalList" :pagination="false" :row-selection="rowSelection">
							<template #action="{ record }">
								<span>
									<a href="javascript:;" @click="addModify(record)">修改</a>
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
				</a-card>
			</a-col>
		</a-row>

		<a-modal v-model:visible="visible" :title="title" width="560px" @ok="handleOk" @cancel="cancelBtn">
			<a-form ref="roleRef" :model="roleForm" :rules="roleRule" :label-col="labelCol">
				<a-form-item required label="名称/描述" name="name">
					<a-input v-model:value="roleForm.name" placeholder="请输入名称或描述" />
				</a-form-item>
				<a-form-item required label="编码" name="code">
					<a-input v-model:value="roleForm.code" placeholder="请输入编码" />
				</a-form-item>
				<a-form-item required label="值" name="value">
					<a-input v-model:value="roleForm.value" placeholder="请输入值" />
				</a-form-item>

				<a-form-item label="备注" name="remarks">
					<a-textarea v-model:value="roleForm.remarks" placeholder="请输入备注" style="height: 100px" />
				</a-form-item>
			</a-form>
		</a-modal>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'

const columns = [
	{
		title: '名称/描述',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '编码',
		dataIndex: 'code',
		key: 'code',
	},
	{
		title: '值',
		dataIndex: 'value',
		key: 'value',
	},
	{
		title: '备注',
		dataIndex: 'remarks',
		key: 'remarks',
	},
	{
		title: '操作',
		dataIndex: 'action',
		key: 'action',
		slots: { customRender: 'action' },
	},
]
const journalList = [
	{ name: 1, code: '1', value: '1', remarks: '十天不更新，会被锁定' },
	{ name: 1, code: '1', value: '2', remarks: '十天不更新，会被锁定' },
	{ name: 1, code: '1', value: '1', remarks: '十天不更新，会被锁定' },
]

export default defineComponent({
	components: { PlusOutlined },
	setup() {
		const search = ref<string>()
		const searchValue = ref<string>()

		const roleForm = reactive({
			code: '',
			name: '',
			remarks: '',
		})
		const total = ref<number>(1)
		const getList = () => {
			console.log('数据')
		}
		const value = ref<string>('5')
		const seachChange = (value: string) => {
			console.log(value)
		}
		watch(search, (value: number) => {
			console.log('value', value)
		})
		const radioChange = (e: object) => {
			console.log(e.target.value)
		}
		const visible = ref<boolean>(false)
		const title = ref<string>('')
		const type = ref<boolean>(false)
		const addModify = (value: string) => {
			type.value = value == 'add'
			title.value = type.value ? '新增' : '编辑'
			visible.value = true
		}
		const roleRef = ref(null)
		const roleRule = {
			code: [{ required: true, message: '请输入编码！', trigger: 'blur' }],
			name: [{ required: true, message: '请输入名称或描述！', trigger: 'blur' }],
			value: [{ required: true, message: '请输入值！', trigger: 'blur' }],
		}
		const cancelBtn = () => {
			roleRef.value.resetFields()
			visible.value = false
		}
		const handleOk = () => {
			roleRef.value.validateFields().then(() => {
				if (type.value) {
					alert('新增')
				} else {
					alert('编辑')
				}
			})
		}
		const reset = () => {
			searchValue.value = ''
		}

		return {
			columns,
			journalList,
			value,
			total,
			visible,
			title,
			roleForm,
			roleRef,
			roleRule,
			search,
			searchValue,
			getList,
			seachChange,
			radioChange,
			addModify,
			cancelBtn,
			handleOk,
			reset,
			labelCol: { span: 4 },
			wrapperCol: { span: 24 },
		}
	},
})
</script>

<style lang="scss" scoped>
.journal {
	.table {
		box-sizing: border-box;
		list-style: none;
		margin-top: 20px;
		font-size: 14px;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 16px;
		div {
			height: 32px;
		}
	}
	.journalList {
		.borderbottom {
			border-bottom: 1px solid #ebedf0;
			padding-bottom: 17px;
		}
		.add {
			width: 78px;
			height: 32px;
		}
		.btn {
			width: 60px;
			height: 32px;
		}
		.mr10 {
			margin-right: 15px;
		}
		.input {
			width: 249px;
			height: 31px;
		}
	}
}
.ant-card-bordered {
	height: 100%;
}
.ant-radio-button-wrapper {
	position: static;
	border: 0;
	border-right: 0;
}
.ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
	background: rgba(0, 145, 255, 0.1);
	color: #0091ff;
}

.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
	background-color: white;
}
</style>
