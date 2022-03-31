<script setup lang="ts">
import api, { useAxios } from '@/api'

function useTableData() {
  const { data, loading, start } = useAxios(api.home.tableData)
  // 发出请求
  start('user', 'pass')

  return {
    data,
    loading,
    refresh: () => start('user', 'pass'),
  }
}

const { data, loading, refresh } = useTableData()
// 语法提示
// eslint-disable-next-line no-console
console.log(data.value.params2)

</script>

<template>
  <router-view />
</template>
