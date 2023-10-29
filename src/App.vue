<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useAlertsStore } from '@/stores/index'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'

const { syncInitialLoaderTheme, syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme, isAppRtl } = useThemeConfig()

const alert = useAlertsStore()
const { global } = useTheme()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()

alert.getAllMasterData()

const tostss: any = ref([])

const tostKey = ref(1)

const expirTost = (item: any, i: number) => {
  setTimeout(() => {
    tostss.value.splice(i, 1)
  }, item.timeOut - 100)
}

watch(() => alert.$state.tosts.length, () => {
  const items = alert.$state.tosts as any

  tostss.value = items
  tostKey.value++

  if (items) {
    items.forEach((item: any, i: number) => {
      expirTost(item, i)
    })
  }
})/* /tost */
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <RouterView />
    </VApp>
  </VLocaleProvider>
  <div :key="tostKey">
    <VSnackbar
      v-for="(tost, index) in tostss"
      :key="index"
      v-model="tost.run"
      :style="`z-index: 10100 !important;transform:translateY(${-index * 60}px) !important;`"
      :timeout="tost.timeOut"
      :color="tost.color"
      class="tosts"
    >
      {{ tost.text }}
      <template #actions>
        <VBtn
          color="pink"
          variant="text"
          icon="ph-x"
          @click="() => { tostss.splice(index, 1); }"
        />
      </template>
    </VSnackbar>
  </div>
</template>

<style lang="scss">
.tosts {
  .v-overlay__content {
    inset-block-end: unset !important;
  }
}
</style>
