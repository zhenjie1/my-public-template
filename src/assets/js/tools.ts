export const noop = () => {}

/**
 * 创建一个空 promise
 */
export const createPromise = <T = any>() => {
  let resolve: (result: T) => any = noop
  let reject: (error: Error) => any = noop
  // eslint-disable-next-line promise/param-names
  const p = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { resolve, reject, p }
}
