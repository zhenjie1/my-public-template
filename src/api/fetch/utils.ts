import type { UseAxiosReturn } from '@vueuse/integrations/useAxios'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import type { Ref, ShallowRef } from 'vue'

// 存储在 idb-keyval 中的前缀标识
export const FETCHURLKEY = 'APICATCH'

/**
 * - api 接口返回的**数据**结构
 */
export interface FetchResult<T = Data> {
  code: number
  data: T
  msg?: string
}

type SuccessFn<T> = (cb: T) => void
type FailFn<T> = (data: AxiosError<T>) => void

/**
 * - api 函数最终返回的结构
 */
export type APIFetchReturn<T, P extends Data[], R> = Omit<UseAxiosReturn<R>, 'data'> & {
  start: (...args: P) => APIFetchReturn<T, P, R>
  loading: UseAxiosReturn<T>['isLoading']
  finished: UseAxiosReturn<T>['isFinished']
  data: Ref<R>
  sourceData: ShallowRef<FetchResult<R> | undefined>
  success: (cb: SuccessFn<R>) => void
  fail: (error: FailFn<R>) => void

  [key: string]: any
}

// 自定义配置
export interface Config {
  /**
   * 是否是上传文件
   */
  file?: boolean
  /**
   * 读取数据的路径
   */
  dataPath?: string
  /**
   * 要排除的值
   */
  exclude?: any[]
  isCode?: boolean
  store?: number | boolean
  codeErrorMessage?: boolean
}

// APIFetch 参数
export type Params = { url: string; defaultValue?: any } & Config & AxiosRequestConfig

/**
 * - 当 status !== 200 时的错误处理
 */
export function errorDealWith() {
  // console.warn(msg)
  // 有消息就显示消息
  // if (msg) ElMessage.error(msg)
}

// 获取函数的参数名
export function getParameterName(fn: () => void): string[] {
  if (typeof fn !== 'object' && typeof fn !== 'function') return []
  const COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  const DEFAULT_PARAMS = /=[^,)]+/mg
  const FAT_ARROWS = /=>.*$/mg
  let code = fn.prototype ? fn.prototype.constructor.toString() : fn.toString()
  code = code
    .replace(COMMENTS, '')
    .replace(FAT_ARROWS, '')
    .replace(DEFAULT_PARAMS, '')
  const result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g)
  return result === null ? [] : result
}
