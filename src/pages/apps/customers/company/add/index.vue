<script setup lang="ts">
import { VForm } from 'vuetify/components'
import VerticalStepper from '@/views/base/VerticalStepper.vue'
import CompanyInformation from '@/views/apps/customers/company/CompanyInformation.vue'
import CompanyAddress from '@/views/apps/customers/company/CompanyAddress.vue'
import PersonalInformation from '@/views/apps/customers/personal/PersonalInformation.vue'
import PersonalAddress from '@/views/apps/customers/personal/PersonalAddress.vue'

const emit = defineEmits(['update:isDrawerAddcompanyOpen'])
const CompanyAddressKey = ref(0)
const panels = ref([0])

const steps = [
  {
    title: 'company_information',
    icon: 'ph-buildings',
    disabled: false,
    subject: 'comapany',
    action: 'create',
  },
  {
    title: 'company_address',
    icon: 'ph-map-pin-line',
    disabled: false,
    subject: 'company_address',
    action: 'create',
  },
]

const timeLines = [
  {
    title: 'Personal Information',
    icon: 'ph-folder-simple-user',
    componentNames: [PersonalInformation, PersonalAddress],
    color: 'warning',
  },
  {
    title: 'Personal Address',
    icon: 'ph-map-pin-line',
    color: 'primary',
  },
]

const all = () => {
  panels.value = ['personal']
}// /all

const none = () => {
  panels.value = []
}// /none

const route = useRoute()
const id = ref(route.params.id || null)

const companyId = (compnyId: string) => {
  id.value = compnyId
  CompanyAddressKey.value++
}// /companyId

const addedAddress = () => {
  id.value = null
  CompanyAddressKey.value++
}// /addedAddress
</script>

<template>
  <VTimeline
    side="end"
    align="start"
  >
    <VTimelineItem
      v-for="(item, i) in timeLines"
      :key="i"
      :dot-color="item.color"
      :icon="item.icon"
      fill-dot
    >
      <VSheet>
        <VExpansionPanels
          v-model="panels"
          multiple
        >
          <VExpansionPanel>
            <VExpansionPanelTitle>{{ item.title }}</VExpansionPanelTitle>
            <VExpansionPanelText>
              <VForm>
                <Component
                  :is="componentName"
                  v-for="(componentName, key) in item.componentNames"
                  :key="key"
                />
              </VForm>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VSheet>
    </VTimelineItem>
  </VTimeline>

  <!--
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
  -->
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

