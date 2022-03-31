<template>
	<a-layout style="height: -webkit-fill-available; width: 100%; height: 100%">
		<a-layout-sider v-model:collapsed="collapsed" class="side" width="240" :trigger="null" collapsible>
			<div class="logo" />
			<a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" theme="dark" :inline-collapsed="collapsed">
				<template v-for="item in list" :key="item.key">
					<template v-if="!item.children">
						<a-menu-item :key="item.key">
							<template #icon>
								<PieChartOutlined />
							</template>
							<!--              <div @click="jumps(item)">{{ item.title }}</div>-->
							<router-link :to="item.path">{{ item.title }}</router-link>
						</a-menu-item>
					</template>
					<template v-else>
						<sub-menu :key="item.key" :menu-info="item">
							<!--              <router-link :to="item.path">{{ item.title }}</router-link>-->
						</sub-menu>
					</template>
				</template>
			</a-menu>
		</a-layout-sider>
		<a-layout>
			<a-layout-header style="background: #fff; padding: 0">
				<div class="headerList">
					<div>
						<menu-unfold-outlined v-if="collapsed" class="trigger" @click="toggleCollapsed" />
						<menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
					</div>
					<div class="users">
						<div class="users userInfo">
							<div>{{ username }}</div>
							<div>({{ department }})</div>
						</div>
						<div class="users" style="font-size: 12px; margin-right: 20px">
							<div>今天是&nbsp;{{ year }}年{{ month }}月{{ date }}日 {{}}</div>
							&nbsp;
							<div>{{ getLunarDay.lunarYear }}({{ getLunarDay.zodiac }}){{ getLunarDay.dateStr }}</div>
						</div>
						<div class="vertical"></div>
						<div class="users">
							<div class="users" style="cursor: pointer">
								<div style="width: 20px; height: 20px" class="users">
									<UnlockOutlined />
								</div>
								<span style="font-size: 12px; margin-right: 20px; color: #4b4c4c">修改密码</span>
							</div>
							<div class="users" style="cursor: pointer">
								<div style="width: 20px; height: 20px" class="users">
									<PoweroffOutlined />
								</div>
								<span style="font-size: 12px; margin-right: 20px; color: #4b4c4c">注销</span>
							</div>
						</div>
					</div>
				</div>
			</a-layout-header>
			<div style="background: #fff; padding: 0" class="tabs">
				<a-tabs default-active-key="1" @change="callback">
					<a-tab-pane key="1" tab="Tab 1"> </a-tab-pane>
					<a-tab-pane key="2" tab="Tab 2" force-render> </a-tab-pane>
					<a-tab-pane key="3" tab="Tab 3"> </a-tab-pane>
				</a-tabs>
			</div>

			<div :style="{ marginLeft: '24px', marginTop: '24px' }">
				<a-breadcrumb>
					<a-breadcrumb-item v-for="(item, index) in listes" :key="item.name">
						<router-link v-if="item.name != name" :to="{ path: item.path === '' ? '/' : item.path }">{{ item.meta.title }}</router-link>
						<span v-else>{{ item.meta.title }}</span>
					</a-breadcrumb-item>
				</a-breadcrumb>
				<br />
			</div>
			<a-layout-content
				class="task-scrollbar"
				:style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px', marginTop: 0 }"
			>
				<!--        <router-view ></router-view>-->
				<router-view :key="$route.fullPath" v-slot="{ Component }" class="router-view">
					<transition :name="transitionName" mode="out-in">
						<keep-alive>
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script lang="ts">
import { MailOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, PoweroffOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { getLunar } from 'chinese-lunar-calendar'
import { defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Route {
	path: string
	breadcrumbName: string
	children?: Array<{
		path: string
		breadcrumbName: string
	}>
}

const SubMenu = {
	name: 'SubMenu',
	props: {
		menuInfo: {
			type: Object,
			default: () => ({}),
		},
	},

	template: `
    <a-sub-menu :key="menuInfo.key">
    <template #icon>
      <MailOutlined/>
    </template>
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children">
        <a-menu-item :key="item.key">
          <template #icon>
            <PieChartOutlined/>
          </template>
          <router-link :to="item.path">{{ item.title }}</router-link>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.key">
          <router-link :to="item.path">{{ item.title }}</router-link>
        </sub-menu>
      </template>
    </template>
    </a-sub-menu>
  `,
	components: {
		PieChartOutlined,
		MailOutlined,
	},
}

const list = ref([
	{
		key: '0',
		title: '首页',
		breadcrumbName: '首页',
		path: '/home',
	},
	{
		key: '1',
		title: '会员管理',
		breadcrumbName: '会员管理',
		children: [],
	},
	{
		key: '2',
		title: '等级管理',
		breadcrumbName: '等级管理',
		path: '',
		children: [
			{
				key: '2.1',
				title: '会员等级设定',
				path: '/level/levelSetting',
				breadcrumbName: '会员等级设定',
			},
		],
	},
	{
		key: '3',
		title: '系统管理',
		breadcrumbName: '系统管理',
		children: [
			{
				key: '3.3',
				title: '基础配置',
				breadcrumbName: '基础配置',
				path: '',
				children: [
					{
						key: '3.3.1',
						title: '数据字典',
						breadcrumbName: '数据字典',
						path: '/system/data_dictionary/data_dictionary',
					},
					{
						key: '3.3.2',
						title: '日志管理',
						breadcrumbName: '日志管理',
						path: '/system/data_dictionary/log_mgt',
					},
					{
						key: '3.3.3',
						title: '系统参数',
						breadcrumbName: '系统参数',
						path: '/system/data_dictionary/system_params',
					},
				],
			},
			{
				key: '3.1',
				title: '总部管理',
				breadcrumbName: '总部管理',
				path: '/system/general',
				children: [
					{ key: '3.1.1', title: '部门管理', breadcrumbName: '等级管理', path: '/system/general/dept_mgt' },
					{ key: '3.1.2', title: '角色管理', breadcrumbName: '角色管理', path: '/system/general/hero_mgt' },
					{ key: '3.1.3', title: '员工管理', breadcrumbName: '员工管理', path: '/system/general/staff_mgt' },
				],
			},
			{
				key: '3.2',
				title: '经销商管理',
				breadcrumbName: '经销商管理',
				path: '/system/dealer',
				children: [
					{
						key: '3.2.1',
						title: '经销商管理',
						breadcrumbName: '经销商管理',
						path: '/system/dealer/dealer_mgt',
						// children:[
						// {
						//   key: '3.2.1.1',
						//   title: '经销商管理',
						//   breadcrumbName: '经销商管理',
						//   path: '/system/dealer/dealer_mgt',
						// },
						// {
						//   key: '3.2.1.2',
						//   title: '经销商员工管理',
						//   breadcrumbName: '经销商员工管理',
						//   path: '/system/dealer/staff_mgt',
						// },
						// {
						//   key: '3.2.1.3',
						//   title: '经销商部门管理',
						//   breadcrumbName: '经销商部门管理',
						//   path: '/system/dealer/dept_mgt',
						// },
						// ]
					},
					{
						key: '3.2.2',
						title: '经销商权限管理',
						breadcrumbName: '经销商管理',
						path: '/system/dealer/authority_mgt',
						// children:[
						// {
						//   key: '3.2.2.1',
						//   title: '经销商角色管理',
						//   breadcrumbName: '经销商角色管理',
						//   path: '/system/dealer/role_mgt',
						// },
						// {
						//   key: '3.2.2.2',
						//   title: '经销商权限管理',
						//   breadcrumbName: '经销商权限管理',
						//   path: '/system/dealer/authority_mgt',
						// },
						// ]
					},
				],
			},
			{
				key: '3.4',
				title: '菜单管理',
				breadcrumbName: '菜单管理',
				path: '',
				children: [
					{
						key: '3.4.1',
						title: '菜单管理',
						path: '/central/menu/general/menuSetting',
						breadcrumbName: '菜单管理',
					},
				],
			},
		],
	},
])

const username = ref<string>('Alex Lee')

const department = ref<string>('长安马自达总部')

const year = ref<number>(new Date().getFullYear())

const month = ref<number>(new Date().getMonth() + 1)

const date = ref<number>(new Date().getDate())

export default defineComponent({
	components: {
		'sub-menu': SubMenu,
		MenuFoldOutlined,
		MenuUnfoldOutlined,
		PieChartOutlined,
		UnlockOutlined,
		PoweroffOutlined,
	},

	setup() {
		const collapsed = ref<boolean>(false)

		const transitionName = ref<string>('slide-left')

		const routerTime = ref<number>(0)

		const name = ref('')

		const router = useRoute()

		const getLunarDay = ref('')

		const weekDate = ref('')

		const toggleCollapsed = () => {
			console.log(collapsed)
			collapsed.value = !collapsed.value
		}

		const getDays = () => {
			getLunarDay.value = getLunar(year.value, month.value, date.value)
		}

		const callback = (key) => {
			console.log(key)
		}

		const jumps = (item) => {
			useRouter().push(item.path)
		}

		const getWeekDate = () => {
			const now = new Date()
			const day = now.getDay()
			const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
			weekDate.value = weeks[day]
		}

		const state = reactive({
			listes: ref<Data[]>([]),
		})

		// router.currentRoute.value.matched.forEach(item => {
		//   routes.push(item)
		// })

		// name = router.currentRoute.value.name

		onMounted(() => {
			getDays()
			getWeekDate()

			const matched = router.matched // 获取菜单对应的路由信息
			state.listes = matched
		})

		// watch
		watch(
			() => router.matched,
			(newVal, oldVal) => {
				const matched = newVal
				state.listes = matched // 更新路由菜单数组
			}
		)

		return {
			...toRefs(state),
			toggleCollapsed,
			callback,
			jumps,
			getDays,
			getWeekDate,
			list,
			username,
			department,
			getLunarDay,
			year,
			weekDate,
			month,
			date,
			name,
			collapsed,
			basePath: '/',
			selectedKeys: ref(['1']),
			openKeys: ref(['2']),
			transitionName,
			routerTime,
		}
	},

	methods: {
		titleClicks() {
			console.log(1234)
		},

		// getDays() {
		//   getLunarDay = getLunar(year, month, date)
		//   console.log(getLunarDay, 'getLunarDay')
		// },
	},
})
</script>
<style lang="scss" scoped>
.tabs {
	::v-deep .ant-tabs-bar {
		margin: 0;
	}
}

.side {
	background: rgba(2, 23, 45, 1);
	:deep.ant-menu-item-selected {
		background: rgba(0, 145, 255, 0.2) !important;
		color: rgba(0, 145, 255, 1) !important;

		:deep .ant-menu-item-selected .anticon + span {
		}
	}
}

.trigger {
	font-size: 18px;
	line-height: 64px;
	padding: 0 24px;
	cursor: pointer;
	transition: color 0.3s;
}

trigger:hover {
	color: #1890ff;
}

.logo {
	height: 32px;
	background: rgba(255, 255, 255, 0.3);
	margin: 16px;
}

.site-layout .site-layout-background {
	background: #fff;
}

.headerList {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.users {
		display: flex;
		align-items: center;
	}
}

.userInfo {
	font-size: 14px;
	font-family: PingFang SC-Medium, PingFang SC;
	font-weight: 600;
	color: rgba(75, 76, 76, 1);
	margin-right: 10px;
}

.vertical {
	width: 1px;
	height: 24px;
	background: rgba(0, 0, 0, 0.15);
	border-radius: 0px 0px 0px 0px;
	opacity: 1;
	margin-right: 20px;
}

.task-scrollbar {
	overflow-y: scroll;
	scrollbar-color: transparent transparent;
	scrollbar-track-color: transparent;
	-ms-scrollbar-track-color: transparent;
}

.task-scrollbar::-webkit-scrollbar {
	/*滚动条整体样式*/
	width: 10px;
	/*高宽分别对应横竖滚动条的尺寸*/
	height: 1px;
}

.task-scrollbar::-webkit-scrollbar-thumb {
	/*滚动条里面小方块*/
	border-radius: 10px;
	//box-shadow: inset 0 0 5px rgba(20, 72, 8, 0.3);
	//background: #0097fb;
}

.task-scrollbar::-webkit-scrollbar-track {
	/*滚动条里面轨道*/
	border-radius: 10px;
	background: #f5f8fa;
}
</style>
