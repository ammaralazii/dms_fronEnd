<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import CompanyInformation from '@/views/apps/customers/company/CompanyInformation.vue'
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'
import AuthorizedInformation from '@/views/apps/customers/company/AuthorizedInformation.vue'

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
  CompanyAuthorizedInfo.value++
}// /companyId

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

