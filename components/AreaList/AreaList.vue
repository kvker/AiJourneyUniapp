<template>
  <view class="area-list-component">
    com
  </view>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue'

  defineProps({
    title: {
      type: String,
      required: true,
    }
  })
</script>

<style>
  .area-list-component {
    height: 38vh;
  }
</style>