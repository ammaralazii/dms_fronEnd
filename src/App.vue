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

const tostss = computed(() => {
  return alert.$state.tosts
})/* /tost */
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <template>
        <VSnackbar
          v-for="(tost, index) in tostss"
          :key="index"
          v-model="tost.run"
          :style="`position: fixed;z-index: 1100;bottom:${index * 60}px`"
          :timeout="tost.timeOut"
          :color="tost.color"
          class="d-flex"
        >
          {{ tost.text }}
          <template #actions>
            <VBtn
              color="pink"
              variant="text"
              icon="ph-x"
              @click="tost.run = false && removeTost(index)"
            />
          </template>
        </VSnackbar>
      </template>
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>
