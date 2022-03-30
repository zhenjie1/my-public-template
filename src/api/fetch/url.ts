import { get } from 'lodash'
import type { Params } from './utils'

export const ajaxUrl = new URL('https://www.niu-box.com/api')
/**
 * 获取请求头
 * @returns {string} 返回结果
 */
export const ajaxPath = () => {
  const apiUrl = ajaxUrl.href
  return `${apiUrl}`
}

export interface FetchResult<T = Data> {
  code: number
  data: T
  message: string
}

/**
 * 通过 lodash.get 获取数据
 */
export function getData<T>(config: Params, data: any): T {
  if (config.dataPath) return get(data, config.dataPath)

  return data
}
