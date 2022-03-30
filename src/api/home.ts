import { apiFetch } from './fetch'

// 返回的数据结构
interface TableDataReturn {
  params1: string
  params2: number
}
export const tableData = (username: string, password: string) => apiFetch<TableDataReturn>({
  url: 'https://www.baidu.com',
  data: {
    username, password,
  },
  dataPath: 'data.data',
})
