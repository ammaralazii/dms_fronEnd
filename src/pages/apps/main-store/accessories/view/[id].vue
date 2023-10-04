<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'

const emit = defineEmits(['update:isDrawerAddDeviceOpen'])
const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit)

const accessoryId = route.params.id || ''

const accessoryFields = ref<any>({
  ContrNo: '',
  SubNo: '',
  CRM_ACCT_Code: '',
  PrePostPaid: '',
  CradStatus: '',
  SubStateReson: '',
  ActiveDate: '',
  TreiffProfile: '',
  accessoryName: '',
  accessoryNo: '',
  ICCID: '',
  accessoryRecivedDate: '',
  accessoryImportDate: '',
  StatusLVN: '',
})

const alert = useAlertsStore()

onMounted(async () => {
  if (accessoryId) {
    const accessorydata = await baseService.get(`accessory/${accessoryId}`) as any
    const data = { ...accessorydata.data }
    if (accessorydata.data) {
      const deviceData = await baseService.get(`device/${accessorydata.data?.device_id}`) as any

      if (deviceData.data)
        data.device_id = deviceData.data.DeviceCode
    }// /if
    console.log('data : ', data)
    accessoryFields.value = data
  }// /if
})// on mounted

const payload = {
  color: '',
  timeOut: 5000,
  run: true,
  text: '',
  position: {
    top: true,
    right: false,
    left: false,
    bottom: false,
  },
  update: false,
}/* /payload */

const dateTimePickerConfig = computed(() => {
  return { enableTime: true, dateFormat: 'Y-m-d H:i' }
})

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    console.log('accessoryFields : ', accessoryFields.value)
    let result = null
    result = await baseService.update('accessory', filterNull(accessoryFields.value), accessoryId as string) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'device added successfly .'

      alert.$state.tosts.push(payload)
    }// /if
  }// /validation
}// /onSubmit
</script>

<template>
  <div>
    <VSheet
      class="mx-auto pa-4"
      height="auto"
    >
      <strong
        class="pa-3"
        style="text-decoration: underline;"
      >
        accessory Details
      </strong>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        class="mt-3"
        :disabled="formDisabled"
        @submit.prevent="onSubmit"
      >
        <VRow>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel class="required">
              Type
            </VLabel>
            <VTextField
              v-model="accessoryFields.AccessoryType"
              :rules="[requiredValidator]"
            />
          </VCol>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel class="required">
              Serial Number
            </VLabel>
            <VTextField
              v-model="accessoryFields.AccessorSerialNumber"
              :rules="[requiredValidator]"
            />
          </VCol>

          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel class="required">
              MAC
            </VLabel>
            <VTextField
              v-model="accessoryFields.AccessoryMAC"
              :rules="[requiredValidator]"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel class="required">
              Import Date
            </VLabel>
            <AppDateTimePicker
              v-model="accessoryFields.AccessoryImportDate"
              :config="dateTimePickerConfig"
              append-inner-icon="ph-calendar"
            />
          </VCol>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel>Manufacture</VLabel>
            <VTextField
              v-model="accessoryFields.AccessoryManufctur"
            />
          </VCol>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel>
              Recive Date
            </VLabel>
            <AppDateTimePicker
              v-model="accessoryFields.AccessoryRecivedDate"
              :config="dateTimePickerConfig"
              append-inner-icon="ph-calendar"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel>
              Costomer Group
            </VLabel>
            <VTextField
              v-model="accessoryFields.CostomerGroup"
            />
          </VCol>

          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel>
              Status LVN
            </VLabel>
            <VTextField
              v-model="accessoryFields.StatusLVN"
            />
          </VCol>

          <VCol
            cols="12"
            lg="4"
            md="4"
            xs="12"
            sm="12"
          >
            <VLabel>
              Device Code
            </VLabel>
            <VTextField v-model="accessoryFields.device_id" />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VBtn
              v-if="!formDisabled && can('update', 'accessory')"
              type="submit"
              class="mt-3"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'accessory')"
              class="mt-3 mx-3"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit accessory
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VSheet>
  </div>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

