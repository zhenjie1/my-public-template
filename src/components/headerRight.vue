<template>
  <div class="users">
    <div class="users userInfo">
      <div>{{username}}123</div>
      <div>({{department}})</div>
    </div>
    <div class="users">
      <div>今天是&nbsp;{{year}}年{{month}}月{{date}}日 {{}}</div>
      &nbsp;
      <div>{{getLunarDay.lunarYear}}({{getLunarDay.zodiac}}){{getLunarDay.dateStr}}</div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
.users {
  display: flex;
}

.userInfo {
  font-size: 14px;
  font-family: PingFang SC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(75, 76, 76, 1);
}
</style>
