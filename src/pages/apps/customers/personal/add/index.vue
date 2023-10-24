<script setup lang="ts">
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'

const emit = defineEmits(['update:isDrawerAddpersonalOpen'])

const route = useRoute()
const id = ref(route.params.id || '')

const personalId = (personaId: string) => {
  id.value = personaId
}// /personalId
</script>

<template>
  <PersonalInformation @personalId="personalId" />
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

