<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { requiredValidator } from '@validators'
import filterNull from '@/helper/filterNull'

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)

const accessoryFields = ref<any>({
  AccessoryType: '',
  AccessorSerialNumber: '',
  AccessoryMAC: '',
  AccessoryManufctur: '',
  AccessoryImportDate: '',
  AccessoryRecivedDate: '',
  CostomerGroup: '',
  StatusLVN: '',
  device_id: '',
})

// /props

const alert = useAlertsStore()

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

    let result = null

    console.log('accessoryFields.value : ', filterNull(accessoryFields.value))
    result = await baseService.create('accessory', filterNull(accessoryFields.value)) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'accessory added successfly .'

      alert.$state.tosts.push(payload)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
      })
    }// /if
  }// /validation
}// /onSubmit
</script>

<template>
  <VSheet
    class="mx-auto pa-4"
    height="auto"
  >
    <strong
      class="pa-3"
      style="text-decoration: underline;"
    >
      Add New accessory
    </strong>
    <VForm
      ref="refForm"
      v-model="isFormValid"
      class="mt-3"
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
          <VTextField
            v-model="accessoryFields.device_id"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VBtn
            type="submit"
            class="mt-3"
            :loading="loading"
          >
            Submit
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VSheet>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

