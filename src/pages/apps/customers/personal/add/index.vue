<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'
import PersonalAddress from '@/views/apps/customers/personal/PersonalAddress.vue'

const emit = defineEmits(['update:isDrawerAddpersonalOpen'])
const PersonalAddressKey = ref(0)

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
const id = ref(route.params.id || '')

const personalId = (personaId: string) => {
  id.value = personaId
  PersonalAddressKey.value++
}// /personalId

const addedAddress = () => {
  id.value = null
  PersonalAddressKey.value++
}// /addedAddress
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #personal_information>
      <PersonalInformation @personalId="personalId" />
    </template>
    <template #personal_address>
      <PersonalAddress
        :key="PersonalAddressKey"
        :personal-id="id || null"
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

