<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import CompanyInformation from '@/views/apps/customers/company/CompanyInformation.vue'
import CompanyAddress from '@/views/apps/customers/company/CompanyAddress.vue'
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'
import AuthorizedInformation from '@/views/apps/customers/company/AuthorizedInformation.vue'

const emit = defineEmits(['update:isDrawerAddcompanyOpen'])
const CompanyAddressKey = ref(0)
const CompanyAuthorizedInfo = ref(0)
const companyKey = ref(0)

const steps = [
  {
    title: 'personal_information',
    icon: 'ph-folder-simple-user',
    disabled: false,
    subject: 'personal',
    action: 'create',
  },
  {
    title: 'company_information',
    icon: 'ph-buildings',
    disabled: false,
    subject: 'company',
    action: 'create',
  },
  {
    title: 'company_address',
    icon: 'ph-map-pin-line',
    disabled: false,
    subject: 'company_address',
    action: 'create',
  },
  {
    title: 'authorized_information',
    icon: 'ph-fingerprint-simple',
    disabled: false,
    subject: 'authorized_people',
    action: 'create',
  },
]

const route = useRoute()
const id = ref(route.params.id || null)
const personlId = ref()

const companyId = (compnyId: string) => {
  id.value = compnyId
  personlId.value = null
  CompanyAddressKey.value++
  CompanyAuthorizedInfo.value++
}// /companyId

const addedAddress = () => {
  id.value = null
  CompanyAddressKey.value++
}// /addedAddress

const addedAuthorizedInfo = () => {
  id.value = null
  CompanyAuthorizedInfo.value++
}

const personalId = (persnlId: string) => {
  personlId.value = persnlId
  companyKey.value++
}
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #personal_information>
      <PersonalInformation @personalId="personalId" />
    </template>
    <template #company_information>
      <CompanyInformation
        :key="companyKey"
        :personal_id="personlId"
        @companyId="companyId"
      />
    </template>
    <template #company_address>
      <CompanyAddress
        :key="CompanyAddressKey"
        :company-id="id || null"
        @addedAddress="addedAddress"
      />
    </template>
    <template #authorized_information>
      <AuthorizedInformation
        :key="CompanyAuthorizedInfo"
        :company_id="id"
        @addedAuthorizedInfo="addedAuthorizedInfo"
      />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

