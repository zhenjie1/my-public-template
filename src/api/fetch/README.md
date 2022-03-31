## 发起请求

1. 第一步：定义请求方法

> 从 **@/api/fetch/fetch** 导入 apiFetch
```ts
// api/login.ts
import { apiFetch } from '@/api/fetch/fetch'

// 返回类型
interface LoginReturn {
  code: number
  data: {
    userInfo: Record<string, any>
  }
  msg: string
}
export const loginSubmit = (username: string, password: string) => apiFetch<LoginReturn>({
// 参数兼容 AxiosRequestConfig
  url: 'url',
  method: 'get',
  data: {
    username,
    password,
  },
})

// api/index.ts
// eslint-disable-next-line import/first
import * as login from './login'
const api = {
  // 新增 login
  login,
}
```
2. 第二步：使用
```vue
<script lang="ts" setup>
import api, { useAxios } from '@/api'

// useAxios 支持 async/await 语法
// const { data, loading, start } = await useAxios(api.login.loginSubmit)
const {
  // 类型自动推导为 LoginReturn
  data,
  // 发请求时为 true，成功或失败后自动改为 false
  loading,
  // 真正调用发请求的地方，传入的参数与 loginSubmit 一致
  start,
  // 请求出错时，错误内容
  error,
} = useAxios(api.login.loginSubmit)

const submit = () => {
  // 对数据进行验证

  // 验证通过，发送请求
  start('username', 'password')
}
</script>

<template>
  <button :loading="loading" @click="submit">
    登录
  </button>
</template>
```