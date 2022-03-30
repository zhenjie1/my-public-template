<script setup lang="ts">
import { useAxios } from './api/fetch'
import api from '@/api'

function useTableData() {
  /**
   * api 请求示例
   */
  const { data, loading, start } = useAxios(api.home.tableData)
  // 发出请求
  start('user', 'pass')

  return {
    data,
    loading,
    refresh: start,
  }
}

const { data, loading, refresh } = useTableData()
// 语法提示
// eslint-disable-next-line no-console
console.log(data.value.params1)

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})
</script>

<template>
  <router-view />
</template>
