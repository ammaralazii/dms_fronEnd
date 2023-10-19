<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import CompanyInformation from '@/views/apps/customers/company/CompanyInformation.vue'
import CompanyAddress from '@/views/apps/customers/company/CompanyAddress.vue'

const emit = defineEmits(['update:isDrawerAddcompanyOpen'])
const CompanyAddressKey = ref(0)

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
const id = ref(route.params.id || null)

const companyId = (compnyId: string) => {
  console.log('compnyId : ', compnyId)
  id.value = compnyId
  CompanyAddressKey.value++
}// /companyId

const addedAddress = () => {
  id.value = null
  CompanyAddressKey.value++
}// /addedAddress
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #company_information>
      <CompanyInformation @companyId="companyId" />
    </template>
    <template #company_address>
      <CompanyAddress
        :key="CompanyAddressKey"
        :company-id="id || null"
        @addedAddress="addedAddress"
      />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

