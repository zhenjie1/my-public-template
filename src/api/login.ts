import { apiFetch } from './fetch'

interface LoginReturn {
	username: string
	password: string
}
export const login = (username: string, password: string) =>
	apiFetch<LoginReturn>({
		url: 'https://www.baidu.com',
		data: {
			username,
			password,
		},
		dataPath: 'data.data',
	})
