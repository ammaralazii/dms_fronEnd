<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import type { deviceInfo } from '@/types/interfaces/device-info'
import { emailValidator, integerValidator, requiredValidator } from '@validators'

import { objectToFormData } from '@/helper/objectToFormData'

const emit = defineEmits(['update:isDrawerAddDeviceOpen'])

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)

const requiredFields = ref<deviceInfo>({
  BoxNoMain: '',
  BoxNoSub: '',
  DeviceSerialNumber: '',
  DeviceMAC: '',
  FWVersion: '',
  DeviceManufctur: '',
  DeviceRecivedDate: '',
  IMEI: '',
})

const optionalFields = ref<any>({
  DeciveImportDate: '',
  AgreementCMC: '',
  DeviceType: '',
  CostomerGroup: '',
  StatusLVN: '',
  files: [],
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

    optionalFields.value.file = optionalFields.value.files[0]

    const mergedObject = { ...requiredFields.value, ...optionalFields.value }

    const formData = objectToFormData(mergedObject)
    let result = null
    result = await baseService.create('device', formData) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'device added successfly .'

      alert.$state.tosts.push(payload)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        optionalFields.value.files = []
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
      Add New Device
    </strong>
    <VForm
      ref="refForm"
      v-model="isFormValid"
      class="mt-3"
      @submit.prevent="onSubmit"
    >
      <!-- 👉 required columns -->
      <VRow>
        <!-- 👉 Main box number -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            Main box number
          </VLabel>
          <VTextField
            v-model="requiredFields.BoxNoMain"
            :rules="[requiredValidator, integerValidator]"
          />
        </VCol>

        <!-- 👉 Secondary fund number -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            Secondary fund number
          </VLabel>
          <VTextField
            v-model="requiredFields.BoxNoSub"
            :rules="[requiredValidator, integerValidator]"
          />
        </VCol>

        <!-- 👉 IMEI -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            IMEI
          </VLabel>
          <VTextField
            v-model="requiredFields.IMEI"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Serial number -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            Serial number
          </VLabel>
          <VTextField
            v-model="requiredFields.DeviceSerialNumber"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 MAC -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            MAC
          </VLabel>
          <VTextField
            v-model="requiredFields.DeviceMAC"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Manufctur -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel class="required">
            Manufctur
          </VLabel>
          <VTextField
            v-model="requiredFields.DeviceManufctur"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 FW version -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel
            class="required"
          >
            FW version
          </VLabel>
          <VTextField
            v-model="requiredFields.FWVersion"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Recived date -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <VLabel class="required">
            Recive date
          </VLabel>
          <AppDateTimePicker
            :key="JSON.stringify(dateTimePickerConfig)"
            v-model:model-value="requiredFields.DeviceRecivedDate"
            :rules="[requiredValidator]"
            :config="dateTimePickerConfig"
          />
        </VCol>
      </VRow>

      <!-- 👉 optional columns -->
      <VRow>
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>type</VLabel>
          <VTextField v-model="optionalFields.DeviceType" />
        </VCol>

        <!-- 👉 Agreement CMC -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>Agreement CMC</VLabel>
          <VTextField v-model="optionalFields.AgreementCMC" />
        </VCol>
        <!-- 👉 Costomer Group -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>Costomer Group</VLabel>
          <VTextField v-model="optionalFields.CostomerGroup" />
        </VCol>

        <!-- 👉 StatusLVN -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>StatusLVN</VLabel>
          <VTextField v-model="optionalFields.StatusLVN" />
        </VCol>

        <!-- 👉 Import Date -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>
            Import date
          </VLabel>
          <AppDateTimePicker
            :key="JSON.stringify(dateTimePickerConfig)"
            v-model:model-value="optionalFields.DeciveImportDate"
            :config="dateTimePickerConfig"
          />
        </VCol>

        <!-- 👉 Files -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel>
            Attachment
          </VLabel>
          <VFileInput
            v-model="optionalFields.files"
            append-icon=""
            prepend-icon=""
            prepend-inner-icon="ph-file"
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
            Add
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

