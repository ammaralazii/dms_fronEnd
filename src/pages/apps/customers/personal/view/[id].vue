<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'
import PersonalAddress from '@/views/apps/customers/personal/PersonalAddress.vue'

const emit = defineEmits(['update:isDrawerAddpersonalOpen'])

const steps = [
  {
    title: 'personal_information',
    icon: 'ph-folder-simple-user',
    disabled: false,
  },
  {
    title: 'personal_address',
    icon: 'ph-map-pin-line',
    disabled: false,
  },
]

const route = useRoute()
const id = route.params.id || ''
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #personal_information>
      <PersonalInformation />
    </template>
    <template #personal_address>
      <PersonalAddress :id="id" />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

