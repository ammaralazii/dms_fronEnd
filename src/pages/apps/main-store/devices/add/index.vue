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

  DeciveImportDate: '',
  AgreementCMC: '',
  DeviceType: '',
  files: [],
  DeviceManufctur: '',

})

const optionalFields = ref<any>({
  CostomerGroup: '',
  StatusLVN: '',
  BoxNoMain: '',
  BoxNoSub: '',
  DeviceSerialNumber: '',
  DeviceMAC: '',
  FWVersion: '',
  DeviceRecivedDate: '',
  IMEI: '',
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

    requiredFields.value.file = requiredFields.value.files[0]

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
        requiredFields.value.files = []
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
          <VLabel>
            Main box number
          </VLabel>
          <VTextField
            v-model="optionalFields.BoxNoMain"
            :rules="[integerValidator]"
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
          <VLabel>
            Secondary fund number
          </VLabel>
          <VTextField
            v-model="optionalFields.BoxNoSub"
            :rules="[integerValidator]"
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
          <VLabel>
            IMEI
          </VLabel>
          <VTextField
            v-model="optionalFields.IMEI"
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
          <VLabel>
            Serial number
          </VLabel>
          <VTextField
            v-model="optionalFields.DeviceSerialNumber"
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
          <VLabel>
            MAC
          </VLabel>
          <VTextField
            v-model="optionalFields.DeviceMAC"
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
            v-model="optionalFields.FWVersion"
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
          <VLabel>
            Recive date
          </VLabel>
          <AppDateTimePicker
            :key="JSON.stringify(dateTimePickerConfig)"
            v-model:model-value="optionalFields.DeviceRecivedDate"
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
          <VLabel class="required">
            type
          </VLabel>
          <VTextField
            v-model="requiredFields.DeviceType"
            :rules="[requiredValidator]"
          />
        </VCol>

        <!-- 👉 Agreement CMC -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <VLabel class="required">
            Agreement CMC
          </VLabel>
          <VTextField
            v-model="requiredFields.AgreementCMC"
            :rules="[requiredValidator]"
          />
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
          <VLabel class="required">
            Import date
          </VLabel>
          <AppDateTimePicker
            :key="JSON.stringify(dateTimePickerConfig)"
            v-model:model-value="requiredFields.DeciveImportDate"
            :config="dateTimePickerConfig"
            :rules="[requiredValidator]"
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
          <VLabel class="required">
            Attachment
          </VLabel>
          <VFileInput
            v-model="requiredFields.files"
            append-icon=""
            prepend-icon=""
            prepend-inner-icon="ph-file"
            :rules="[requiredValidator]"
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

