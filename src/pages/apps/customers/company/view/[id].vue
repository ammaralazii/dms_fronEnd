<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import CompanyInformation from '@/views/apps/customers/company/CompanyInformation.vue'
import CompanyAddress from '@/views/apps/customers/company/CompanyAddress.vue'

const steps = [
  {
    title: 'company_information',
    icon: 'ph-buildings',
    disabled: false,
  },
  {
    title: 'company_address',
    icon: 'ph-map-pin-line',
    disabled: false,
  },
]

const route = useRoute()
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #company_information>
      <CompanyInformation />
    </template>
    <template #company_address>
      <CompanyAddress />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

