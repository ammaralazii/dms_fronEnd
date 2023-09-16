<script setup lang="ts">
import RoleContent from '@/views/roles/role-content.vue'
</script>

<template>
  <VCard>
    <RoleContent />
  </VCard>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
