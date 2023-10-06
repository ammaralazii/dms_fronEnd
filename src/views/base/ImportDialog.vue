<script setup lang="ts">
import { baseService } from '@/api/BaseService'
import { useAlertsStore } from '@/stores'
import { requiredValidator } from '@/@core/utils/validators'

const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  filename: {
    required: true,
    type: String,
  },
  url: {
    required: true,
    type: String,
  },
})

const emit = defineEmits(['close'])

const importFile = ref()
const loadingUpload = ref(false)

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

const alert = useAlertsStore()

const uploadExcelFile = async () => {
  if (importFile.value) {
    const excelFile = importFile.value[0]

    loadingUpload.value = true

    const formData = new FormData()

    formData.append('file', excelFile)

    let result = null

    result = await baseService.create(props.url, formData) as any

    loadingUpload.value = false

    if (result.success) {
      importFile.value = ''
      emit('close')
      payload.color = 'success'
      payload.text = 'file uploaded successfly .'
      alert.$state.tosts.push(payload)
    }// /if
  }
  else {
    payload.color = 'warning'
    payload.text = 'Choose a file before this operation .'
    alert.$state.tosts.push(payload)
  }
}// /uploadExcelFile
</script>

<template>
  <VRow justify="center">
    <VDialog
      v-model="props.dialog"
      persistent
      width="500"
    >
      <template #activator="{ props }" />
      <VCard>
        <VCardTitle>
          Upload excel file
        </VCardTitle>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <VFileInput
                v-model="importFile"
                label="import file"
                prepend-inner-icon="ph-file"
                prepend-icon=""
                append-icon=""
                :rules="[requiredValidator]"
                accept=".xlsx, .csv"
              />
            </VCol>
            <VCol cols="12">
              <a
                :href="`/src/static/${props.filename}.xlsx`"
                :download="`${props.filename}.xlsx`"
                class="text-on-success"
              >
                <VAlert
                  variant="outlined"
                  color="primary"
                  theme="dark"
                  prominent
                  height="40"
                  class="d-flex"
                >
                  <VIcon left>
                    ph-download
                  </VIcon>
                  {{ props.filename.replace('_', ' ') }}
                </VAlert>
              </a>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12">
              <VBtn
                color="primary"
                variant="text"
                :loading="loadingUpload"
                @click="uploadExcelFile"
              >
                Import
              </VBtn>
              <VBtn
                variant="text"
                color="error"
                @click="$emit('close')"
              >
                Close
              </VBtn>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </VRow>
</template>
