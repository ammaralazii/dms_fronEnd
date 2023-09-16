<script setup lang="ts">
import RoleContent from '@/views/roles/role-content.vue'
</script>

<template>
  <VCard>
    <RoleContent />
  </VCard>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
