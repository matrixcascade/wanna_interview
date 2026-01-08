<template>
  <div class="container">
    <div class="main">
      <XmovAvatarComponent />
      <TypeContentBox />
    </div>
  </div>
</template>

<script setup lang="ts">
import XmovAvatarComponent from './xmovavatar/AvatarRender.vue'
import TypeContentBox from './typecontentbox/TypeContentBox.vue'
import {avatarService} from './xmovavatar/avatar'
import { onMounted, onBeforeUnmount } from 'vue'

function onPageClose() {
  avatarService.disconnect()
}

onMounted(() => {
  window.addEventListener('beforeunload', onPageClose)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', onPageClose)
})

</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.container {
  width: 100%;
  height: 100%;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
