<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { nextTick } from 'vue'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'
import { ethnic } from '@/types/enum/ethnic'

const emit = defineEmits(['update:isDrawerAddpersonalOpen'])

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const personalItem = ref()

const personal = ref<any>({
  personalId: '',
  personalFirstName: '',
  personalSecondName: '',
  personalTirdName: '',
  personalIdNumber: '',
  PersonalIDDateIssued: '',
  personalBirthDate: '',
  personalEthnic: '',
  personalMaritalStatus: '',
  personalGender: '',
  personalResidencyCardID: '',
  personalPhoneNumber: '',
  personalPhoneNumber2: '',
  personalEmail: '',
  code: '',
})

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
  return { enableTime: true, dateFormat: 'Y-m-d' }
})

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    personal.value.code = 'IQ'
    personalItem.value = { ...personal.value }

    let result = null
    result = await baseService.create('personal', filterNull(personalItem.value)) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'personal added successfly .'

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
  <div>
    <VSheet
      class="mx-auto pa-4"
      height="auto"
    >
      <strong
        class="pa-3"
        style="text-decoration: underline;"
      >
        personal Details
      </strong>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        class="mt-3"
        @submit.prevent="onSubmit"
      >
        <VRow>
          <!-- 👉 First Name -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              First Name
            </VLabel>
            <VTextField
              v-model="personal.personalFirstName"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Second Name -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Second Name
            </VLabel>
            <VTextField
              v-model="personal.personalSecondName"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Third Name -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Third Name
            </VLabel>
            <VTextField
              v-model="personal.personalTirdName"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 ID number -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              ID number
            </VLabel>
            <VTextField
              v-model="personal.personalIdNumber"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 ID Date Issued -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              ID Date Issued
            </VLabel>
            <AppDateTimePicker
              :key="JSON.stringify(dateTimePickerConfig)"
              v-model:model-value="personal.PersonalIDDateIssued"
              :config="dateTimePickerConfig"
              :rules="[requiredValidator]"
              append-inner-icon="ph-calendar"
            />
          </VCol>

          <!-- 👉 Date of Birth  -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Date of Birth
            </VLabel>
            <AppDateTimePicker
              :key="JSON.stringify(dateTimePickerConfig)"
              v-model:model-value="personal.personalBirthDate"
              :config="dateTimePickerConfig"
              :rules="[requiredValidator]"
              append-inner-icon="ph-calendar"
            />
          </VCol>

          <!-- 👉 Ethnic  -->
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
              Ethnic
            </VLabel>
            <VAutocomplete
              v-model="personal.personalEthnic"
              :rules="[requiredValidator]"
              :items="ethnic"
            />
          </VCol>

          <!-- 👉 Marital Status  -->
          <VCol
            cols="12"
            xl="3"
            md="3"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Marital Status
            </VLabel>
            <VTextField
              v-model="personal.personalMaritalStatus"
              :rules="[requiredValidator]"
            />
          </VCol>
        </VRow>

        <VRow>
          <!-- 👉 Gender  -->
          <VCol
            cols="12"
            xl="4"
            md="4"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Gender
            </VLabel>
            <VAutocomplete
              v-model="personal.personalGender"
              :items="gender"
              :rules="[requiredValidator]"
            />
          </VCol>

          <!-- 👉 Residency Card ID  -->
          <VCol
            cols="12"
            xl="4"
            md="4"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Residency Card ID
            </VLabel>
            <VTextField
              v-model="personal.personalResidencyCardID"
              :rules="[requiredValidator]"
            />
          </VCol>
          <!-- 👉 Phone number -->
          <VCol
            cols="12"
            xl="4"
            md="4"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Phone number
            </VLabel>
            <VTextField
              v-model="personal.personalPhoneNumber"
              :rules="[requiredValidator, integerValidator]"
            />
          </VCol>

          <!-- 👉 Phone number 2 -->
          <VCol
            cols="12"
            xl="4"
            md="4"
            sm="12"
            xs="12"
          >
            <VLabel>
              Phone number 2
            </VLabel>
            <VTextField
              v-model="personal.personalPhoneNumber2"
              :rules="[integerValidator]"
            />
          </VCol>

          <!-- 👉 Email -->
          <VCol
            cols="12"
            xl="4"
            md="4"
            sm="12"
            xs="12"
          >
            <VLabel class="required">
              Email
            </VLabel>
            <VTextField
              v-model="personal.PersonalEmail"
              :rules="[requiredValidator, emailValidator]"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VBtn
              v-if=" can('create', 'personal')"
              type="submit"
              class="mt-3"
              :loading="loading"
            >
              Save
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

