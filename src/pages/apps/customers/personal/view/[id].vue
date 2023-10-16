<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import type { personalInfo } from '@/types/interfaces/personal-info'
import { gender } from '@/types/enum/gender'
import { ethnic } from '@/types/enum/ethnic'
import VerticalStepper from '@/views/base/VerticalStepper.vue'

const emit = defineEmits(['update:isDrawerAddpersonalOpen'])
const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const personalItem = ref()
const LoadingForGetData = ref(true)

const steps = [
  {
    title: 'personal_information',
    icon: 'ph-folder-simple-user',
  },
  {
    title: 'personal_address',
    icon: 'ph-map-pin-line',
  },
]

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit)

const personalId = route.params.id || ''

const personal = ref<personalInfo>({
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

onMounted(async () => {
  if (personalId) {
    const personalItem = await baseService.get(`personal/${personalId}`) as any

    if (personalItem.data) {
      personal.value = personalItem.data
      LoadingForGetData.value = false
    }
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
    result = await baseService.update('personal', filterNull(personalItem.value), personalItem.value.PersonalId) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'personal updated successfly .'

      alert.$state.tosts.push(payload)
    }// /if
  }// /validation
}// /onSubmit
</script>

<template>
  <VerticalStepper
    :steps="steps"
  >
    <template #personal_information>
      <VSheet
        class="mx-auto pa-4"
        height="auto"
      >
        <strong
          v-if="!LoadingForGetData"
          class="pa-3"
          style="text-decoration: underline;"
        >
          personal Details
        </strong>
        <VForm
          ref="refForm"
          v-model="isFormValid"
          class="mt-3"
          :disabled="formDisabled"
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
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  First Name
                </VLabel>
                <VTextField
                  v-model="personal.personalFirstName"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Second Name -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Second Name
                </VLabel>
                <VTextField
                  v-model="personal.personalSecondName"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Third Name -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Third Name
                </VLabel>
                <VTextField
                  v-model="personal.personalTirdName"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  pill
                />
              </template>
            </VCol>

            <!-- 👉 ID number -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  ID number
                </VLabel>
                <VTextField
                  v-model="personal.personalIdNumber"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 ID Date Issued -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
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
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Date of Birth  -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
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
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Ethnic  -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
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
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Marital Status  -->
            <VCol
              cols="12"
              xl="3"
              md="3"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Marital Status
                </VLabel>
                <VTextField
                  v-model="personal.personalMaritalStatus"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
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
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Gender
                </VLabel>
                <VAutocomplete
                  v-model="personal.personalGender"
                  :items="gender"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Residency Card ID  -->
            <VCol
              cols="12"
              xl="4"
              md="4"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Residency Card ID
                </VLabel>
                <VTextField
                  v-model="personal.personalResidencyCardID"
                  :rules="[requiredValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>
            <!-- 👉 Phone number -->
            <VCol
              cols="12"
              xl="4"
              md="4"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Phone number
                </VLabel>
                <VTextField
                  v-model="personal.personalPhoneNumber"
                  :rules="[requiredValidator, integerValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Phone number 2 -->
            <VCol
              cols="12"
              xl="4"
              md="4"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel>
                  Phone number 2
                </VLabel>
                <VTextField
                  v-model="personal.personalPhoneNumber2"
                  :rules="[integerValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>

            <!-- 👉 Email -->
            <VCol
              cols="12"
              xl="4"
              md="4"
              sm="12"
              xs="12"
            >
              <template v-if="!LoadingForGetData">
                <VLabel class="required">
                  Email
                </VLabel>
                <VTextField
                  v-model="personal.PersonalEmail"
                  :rules="[requiredValidator, emailValidator]"
                />
              </template>
              <template v-else>
                <Skeletor
                  height="65px"
                  width="100%"

                  pill
                />
              </template>
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <template v-if="!LoadingForGetData">
                <VBtn
                  v-if="!formDisabled && can('update', 'personal')"
                  type="submit"
                  class="mt-3"
                  :loading="loading"
                  :disabled="formDisabled"
                >
                  Save
                </VBtn>

                <VBtn
                  v-if="can('update', 'personal')"
                  class="mt-3 mx-3"
                  color="error"
                  @click="formDisabled = !formDisabled"
                >
                  Edit personal
                </VBtn>
              </template>

              <template v-else>
                <div
                  class="d-flex"
                >
                  <Skeletor
                    v-for="i in 2"
                    :key="i"
                    height="65px"
                    width="150px"
                    pill
                    class="ml-3"
                  />
                </div>
              </template>
            </VCol>
          </VRow>
        </VForm>
      </VSheet>
    </template>
    <template #personal_address>
      this is address page
    </template>
  </VerticalStepper>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

