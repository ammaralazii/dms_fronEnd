<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import ForeignInformation from '@/views/apps/customers/foreign/ForeignInformation.vue'
import OtherInformation from '@/views/apps/customers/foreign/OtherInformation.vue'
import Sars from '@/views/apps/customers/foreign/Sars.vue'
import WorkPermit from '@/views/apps/customers/foreign/WorkPermit.vue'

const steps = [
  {
    title: 'foreign_information',
    icon: 'ph-globe-hemisphere-west',
    disabled: false,
    subject: 'foreign',
    action: 'update',
  },
  {
    title: 'other_information',
    icon: 'ph-folder-notch-plus',
    disabled: false,
    subject: 'other_information',
    action: 'update',
  },
  {
    title: 'SARS',
    icon: 'ph-info',
    disabled: false,
    subject: 'sars',
    action: 'update',
  },
  {
    title: 'work_permit',
    icon: 'ph-identification-card',
    disabled: false,
    subject: 'work_permit',
    action: 'update',
  },
]

const route = useRoute()
const id = ref(route.params.id || '')
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #foreign_information>
      <ForeignInformation />
    </template>

    <template #other_information>
      <OtherInformation
        :foreign-id="id"
      />
    </template>

    <template #SARS>
      <Sars
        :foreign-id="id"
      />
    </template>

    <template #work_permit>
      <WorkPermit
        :foreign-id="id"
      />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

