<script setup lang="ts">
import RoleContent from '@/views/roles/role-content.vue'

import { useAlertsStore } from '@/stores'

const alert = useAlertsStore()

const userId = alert.roles.filter((item: any) => {
  if (item.RoleName === 'user')
    return item.RoleId
})[0] as any
</script>

<template>
  <VCard>
    <RoleContent :id="userId" />
  </VCard>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
