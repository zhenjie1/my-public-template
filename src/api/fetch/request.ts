import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const base = {
	url: 'http://mms-bizapi.cma.zjdev.com/cma-app-mms-hq-api',
}
const http = axios.create({
	baseURL: base.url,
	timeout: 60000,
})

const requset = {
	/**
	 * methods: 请求
	 * @param url 请求地址
	 * @param params 请求参数
	 */
	get(url: string, params: string, data: string) {
		const config: AxiosRequestConfig = {
			method: 'get',
			url,
		}
		if (params) config.params = params
		if (data) config.data = data
		return http(config)
	},
	post(url: string, params: string, query: string) {
		const config: AxiosRequestConfig = {
			method: 'post',
			url,
		}
		if (params) config.data = params
		if (query) config.params = query
		return http(config)
	},
	delete(url: string, params: string, query: string) {
		const config: AxiosRequestConfig = {
			method: 'delete',
			url,
		}
		if (params) config.data = params
		if (query) config.params = query
		return http(config)
	},

	put(url: string, params: string, query: string) {
		const config: AxiosRequestConfig = {
			method: 'put',
			url,
		}
		if (params) config.data = params
		if (query) config.params = query
		return http(config)
	},
}

export default requset
