<script setup lang="ts">
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import ForeignInformation from '@/views/apps/customers/foreign/ForeignInformation.vue'
import OtherInformation from '@/views/apps/customers/foreign/OtherInformation.vue'
import Sars from '@/views/apps/customers/foreign/Sars.vue'
import WorkPermit from '@/views/apps/customers/foreign/WorkPermit.vue'

const emit = defineEmits(['update:isDrawerAddforeignOpen'])
const OtherInformationKey = ref(0)
const SarsKey = ref(0)
const workPermitKey = ref(0)

const steps = [
  {
    title: 'foreign_information',
    icon: 'ph-globe-hemisphere-west',
    disabled: false,
  },
  {
    title: 'other_information',
    icon: 'ph-folder-notch-plus',
    disabled: false,
  },
  {
    title: 'SARS',
    icon: 'ph-info',
    disabled: false,
  },
  {
    title: 'work_permit',
    icon: 'ph-identification-card',
    disabled: false,
  },
]

const route = useRoute()
const sarsId = ref(route.params.id || '')
const otherInfoId = ref(route.params.id || '')
const workPermitId = ref(route.params.id || '')

const foreignId = (foregnId: string) => {
  otherInfoId.value = foregnId
  sarsId.value = foregnId
  workPermitId.value = foregnId

  workPermitKey.value++
  OtherInformationKey.value++
  SarsKey.value++
}// /foreignId

const addedWorkPermit = () => {
  workPermitId.value.value = null
  workPermitKey.value++
}// /addedOtherInformation
</script>

<template>
  <VerticalStepper
    :steps="steps"
    btn
  >
    <template #foreign_information>
      <ForeignInformation @foreignId="foreignId" />
    </template>

    <template #other_information>
      <OtherInformation
        :key="OtherInformationKey"
        :foreign-id="otherInfoId || null"
        @addedOtherInformation="addedOtherInformation"
      />
    </template>

    <template #SARS>
      <Sars
        :key="SarsKey"
        :foreign-id="sarsId || null"
        @addedSars="addedSars"
      />
    </template>

    <template #work_permit>
      <WorkPermit
        :key="workPermitKey"
        :foreign-id="workPermitId || null"
        @addedWorkPermit="addedWorkPermit"
      />
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

