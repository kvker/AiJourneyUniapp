<script lang="ts" setup>
  import {
    inject,
    provide,
  } from 'vue'
  import {
    onLaunch,
    onShow,
    onHide
  } from "@dcloudio/uni-app"

  let global = inject('global')
  onLaunch(() => {
    // console.log('App Launch')
    console.log({ global })
  })
  onShow(() => {
    // console.log('App Show')
  })
  onHide(() => {
    // console.log('App Hide')
  })
</script>

<style>
  /*每个页面公共css */
  @import url(./static/libs/variable.css);
  @import url(./static/libs/main.css);

  page,
  .page {
    background: linear-gradient(180deg, #D4E3FF 0%, #FFF 100%);
  }

  .component {
    height: 100vh;
  }
</style>