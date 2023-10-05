<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import FileDialog from '@/views/apps/devices/FileDialog.vue'
import GetBackFiles from '@/views/apps/devices/view/GetBackFiles.vue'

import { objectToFormData } from '@/helper/objectToFormData'
import sortByDate from '@/helper/sortByDate'

const emit = defineEmits(['update:isDrawerAddDeviceOpen'])
const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const isFileDrawerVisible = ref(false)
const files = ref([])
const device_attachment = ref('')
const deivceItem = ref()
const dialog = ref(false)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit)

const deviceId = route.params.id || ''

const device = ref<any>({
  BoxNoMain: '',
  BoxNoSub: '',
  DeviceSerialNumber: '',
  DeviceMAC: '',
  FWVersion: '',
  DeviceManufctur: '',
  DeviceRecivedDate: '',
  IMEI: '',
  DeciveImportDate: '',
  AgreementCMC: '',
  DeviceType: '',
  CostomerGroup: '',
  StatusLVN: '',
  files: [],
})

const deviceFiles = ref([])

const alert = useAlertsStore()

onMounted(async () => {
  if (deviceId) {
    const deviceItem = await baseService.get(`device/${deviceId}`) as any

    if (deviceItem.data)
      device.value = deviceItem.data
  }
})

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

    deivceItem.value = { ...device.value }

    delete deivceItem.value.files

    if (deviceFiles.value.length > 0)
      deivceItem.value.file = deviceFiles.value[0]

    console.log('deivceItem.value : ', deivceItem.value)

    const formData = objectToFormData(deivceItem.value)
    let result = null
    result = await baseService.updateAsPost('device', formData, deivceItem.value.DeviceId) as any

    loading.value = false
    if (result.success) {
      if (deviceFiles.value.length > 0) {
        dialog.value = true
        let fileResult = null
        fileResult = await baseService.get(`file/get/${deivceItem.value.DeviceAttachment}`) as any
        if (fileResult.success) {
          dialog.value = false
          device.value.files = sortByDate(fileResult?.data, 'created_at') as any
        }
      }
      payload.color = 'success'
      payload.text = 'device added successfly .'

      alert.$state.tosts.push(payload)
    }// /if
  }// /validation
}// /onSubmit

// 👉 Display file drawer
const openFileDrawer = (deviceFiles: any, attachmentDevice: any, check: boolean) => {
  console.log('deviceFiles: ', deviceFiles, ' attachmentDevice : ', attachmentDevice, 'check : ', check)
  isFileDrawerVisible.value = check
  files.value = deviceFiles
  device_attachment.value = attachmentDevice
}// /openFileDrawer
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
        Device Details
      </strong>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        class="mt-3"
        :disabled="formDisabled"
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
              v-model="device.BoxNoMain"
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
              v-model="device.BoxNoSub"
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
              v-model="device.IMEI"
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
              v-model="device.DeviceSerialNumber"
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
              v-model="device.DeviceMAC"
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
              v-model="device.DeviceManufctur"
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
              v-model="device.FWVersion"
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
              v-model:model-value="device.DeviceRecivedDate"
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
              v-model="device.DeviceType"
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
              v-model="device.AgreementCMC"
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
            <VTextField v-model="device.CostomerGroup" />
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
            <VTextField v-model="device.StatusLVN" />
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
              v-model:model-value="device.DeciveImportDate"
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
              <VBtn
                v-if="device.files?.length > 0 && can('get', 'file')"
                class="text-capitalize blak-text"
                variant="text"
                :disabled="false"
                :rules="[required]"
                @click="openFileDrawer(device.files, device.DeviceAttachment, true)"
              >
                get files
              </VBtn>
            </VLabel>
            <VFileInput
              v-model="deviceFiles"
              append-icon=""
              prepend-icon=""
              prepend-inner-icon="ph-file"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VBtn
              v-if="!formDisabled && can('update', 'device')"
              type="submit"
              class="mt-3"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'device')"
              class="mt-3 mx-3"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit Device
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VSheet>

    <FileDialog
      v-model:isDrawerFileOpen="isFileDrawerVisible"
      :files="files"
      :device_attachment="device_attachment"
    />
    <GetBackFiles :dialog="dialog" />
  </div>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

