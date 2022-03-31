import { ref, shallowRef } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import type { AxiosError, AxiosPromise, AxiosResponse, CancelTokenSource } from 'axios'
import axios from 'axios'
import { get } from 'lodash'
import defaultParams, { removeSurplusData } from './defaultParams'
import type { APIFetchReturn, Params } from './utils'

type Success<T> = (data: T) => void
type Fail<T> = (error: AxiosError<T>) => void

export type ApiFnParams<T> = [AxiosPromise<any>, Params, T]
export const apiFetch = <T>(params: Params): ApiFnParams<T> => {
  return [axios(params), params, {} as T]
}

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 * @param url
 * @param config
 */
// export function useAxios<T = any>(config: Params): APIFetchReturn<T> {
export function useAxios<
  T extends(...args: any[]) => ApiFnParams<any> = any,
  R extends ReturnType<T>[2] = ReturnType<T>[2],
  P extends any[] = Parameters<T>,
>(apiFn: T): APIFetchReturn<T, P, R> {
  const response = shallowRef<AxiosResponse<R>>()
  const data = ref<R>({} as R)
  const sourceData = ref({} as any)
  const isFinished = ref(false)
  const isLoading = ref(false)
  const aborted = ref(false)
  const error = shallowRef<AxiosError<R>>()
  const successPool: Success<R>[] = []
  const failPool: Fail<R>[] = []

  // 取消请求
  const cancelToken: CancelTokenSource = axios.CancelToken.source()
  const abort = (message?: string) => {
    if (isFinished.value || !isLoading.value) return

    cancelToken.cancel(message)
    aborted.value = true
    isLoading.value = false
    isFinished.value = false
  }
  // 关闭页面时，取消页面发送的请求
  tryOnUnmounted(() => abort('page unmounted for api abort'))

  let resolve: (arg: any) => void
  let reject: (err: any) => void
  let isPromiseRun = false
  const result: APIFetchReturn<T, P, R> = {
    response,
    data: data as any,
    sourceData,
    error,
    finished: isFinished,
    loading: isLoading,
    isFinished,
    success: (cb: Success<R>) => successPool.push(cb),
    fail: (cb: Fail<R>) => failPool.push(cb),
    isLoading,
    cancel: abort,
    canceled: aborted,
    aborted,
    abort,
    start,
    /**
     * 为 async/await 语法提供支持
     */
    then(res: any, rej: any) {
      isPromiseRun = true
      isLoading.value = true
      resolve = res
      reject = rej
    },
  }

  function start(...args: P) {
    // eslint-disable-next-line prefer-const
    let [promise, config] = apiFn(...args)
    config = defaultParams(config)

    // 删除无效数据
    const dataKey: 'params' | 'data' = config.method?.toLocaleLowerCase() === 'get' ? 'params' : 'data'
    config[dataKey] = removeSurplusData(config[dataKey], config.exclude)

    data.value = config.defaultValue ?? data.value

    promise.then((result) => {
      response.value = result
      if (result.data.code === 0) {
        const resultData = get(result, config.dataPath as string)
        data.value = resultData
        successPool.map(fn => fn(data.value as any))
        resolve?.(resultData)
      } else {
        failPool.map(fn => fn(result as any))
        reject?.(result as any)
        error.value = result as any
      }
    }).catch((e) => {
      error.value = e
      failPool.map(fn => fn(e))
      reject?.(error.value as any)
      // errorDealWith(e.response?.data.msg || e.data?.message)
      if (isPromiseRun) throw error
    }).finally(() => {
      isLoading.value = false
      isFinished.value = true
    })
    return result
  }

  return result
}
