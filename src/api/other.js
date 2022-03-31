import request from './fetch/request'

// 角色列表(type 1是总部  2 是经销商  3 经销商管理员)
export const roleList = (params) => {
	return request.get('/role/queryPage', params)
}
// 角色详情(type 1是总部  2 是经销商  3 经销商管理员)
export const roleDetail = (params) => {
	return request.get('/role/getById', params)
}
// (type 1是总部  2 是经销商  3 经销商管理员)
export const addRoleForm = (params) => {
	return request.post('/role/save', params)
}
// 角色列表 (下拉)  1是总部  2 是经销商  3 经销商管理员
export const getRoleReqVo = (type) => {
	return request.get(`/role/getAllRoleReqVo?type=${type}`)
}

// 编辑角色(type 1是总部  2 是经销商  3 经销商管理员)
export const updateRoleForm = (params) => {
	return request.put('/role/update', params)
}

// 菜单树列表
export const menuTree = (params) => {
	return request.get('/menupermission/getAllByMenuTree', params)
}

// 根据菜单树id获取详情页面
export const menuDetail = (params) => {
	return request.get('/menupermission/getById', params)
}

// 前端名称列表
export const allName = (params) => {
	return request.get('/menupermission/getAllName', params)
}

// api接口列表
export const apiList = (params) => {
	return request.get('/resourceapi/queryPage', params)
}

// 菜单更新
export const upDateMenu = (params) => {
	return request.put('/menupermission/update', params)
}

// 菜单新增
export const saveMenu = (params) => {
	return request.post('/menupermission/save', params)
}

// 菜单删除
export const deleteMenu = (params) => {
	return request.delete(`/menupermission/delete?id=${params}`)
}

// 员工列表
export const getRoleList = (data) => {
	return request.get('/user/queryPage', data)
}
// 员工详情
export const getRoleDetail = (data) => {
	return request.get('/user/getById', data)
}
// 员工导出EXCEL
export const getRoleExcel = (params) => {
	return request.post(`/user/excelExport`, params)
}
// 员工部门下拉列表
export const getRoleDepartment = (type) => {
	return request.get(`/department/listZB?type=${type}`)
}

// 员工修改
export const getRoleUpdate = (data) => {
	return request.put('/user/update', data)
}
// 员工修改密码
export const RoleResetPassword = (params) => {
	return request.put('/user/resetPassword', params)
}
// 不带分页的部门列表
export const allDepartmentList = () => {
	return request.get(`/department/listJXS`)
}
// 添加部门
export const addDepartment = (params) => {
	return request.post(`/department/add`, params)
}
// 根据code查部门信息
export const queryDepartment = (code) => {
	return request.get(`/department/selectDepartmentByCode/${code}`)
}
// 更新部门
export const upDateDepartment = (params) => {
	return request.put(`/department/update`, params)
}
// 查询部门列表
export const departmentList = (params) => {
	return request.get(`/department/listZBPage`, params)
}
// 经销商分页列表
export const dealerList = (data) => {
	return request.get(`/dealer/queryPage`, data)
}
// 经销商部门管理分页列表
export const dealerDeptMgt = (data) => {
	return request.get(`/department/listJXSPage`, data)
}
// 经销商部门详情
export const dealerDetails = (data) => {
	return request.get(`/department/selectById`, data)
}
// 经销商管理员权限列表 GET /dealer/rolelist
export const dealerRoleList = (data) => {
	return request.get(`/dealer/rolelist`, data)
}
// 查询经销商详情
export const dealerRowDetails = (id) => {
	return request.get(`/dealer/detail?id=${id}`)
}
// 查询销售经理/售后经理
export const managerList = (type) => {
	return request.get(`/user/getAllByNameUserRespVos?type=${type}`)
}
// 修改经销商
export const changeManager = (params) => {
	return request.put(`/dealer/update`, params)
}
// 经销商管理员权限列表详情
export const dealerRolDetail = (id) => {
	return request.get(`/dealer/roledetail?id=${id}`)
}
// 经销商管理员权限列表修改
export const dealerRolUpdate = (params) => {
	return request.put(`/dealer/roleupdate`, params)
}
