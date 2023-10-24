<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'
import { ethnic } from '@/types/enum/ethnic'
import { countriesArr, getCountryCode } from '@/types/enum/countries'

const emit = defineEmits(['personalId'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const personalItem = ref()
const LoadingForGetData = ref(true)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const personalId = ref(route.params.id || '')

const alert = useAlertsStore()

onMounted(async () => {
  if (personalId.value) {
    const personalItem = await baseService.get(`personal/${personalId.value}`) as any

    if (personalItem.data) {
      alert.$state.personalItem = personalItem.data
      LoadingForGetData.value = false
    }
  }
  else {
    formDisabled.value = false
    LoadingForGetData.value = false
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

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    personalItem.value = { ...alert.$state.personalItem }

    let result = null
    if (personalId.value) {
      result = await baseService.update('personal', filterNull(personalItem.value), personalItem.value.PersonalId) as any
      if (result.success)
        payload.text = 'personal updated successfly .'
    }
    else {
      result = await baseService.create('personal', filterNull(personalItem.value)) as any
      if (result.data) {
        payload.text = 'personal added successfly .'
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
        })
        emit('personalId', result.data.PersonalId)
      }
    }
    loading.value = false
    payload.color = 'success'
    alert.$state.tosts.push(payload)
  }// /validation
}// /onSubmit
</script>

<template>
  <VSheet
    class="mx-auto pa-4"
    height="auto"
  >
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
              v-model="alert.$state.personalItem.personalFirstName"
              clearable
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
              v-model="alert.$state.personalItem.personalSecondName"
              clearable
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
              v-model="alert.$state.personalItem.personalTirdName"
              clearable
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
              v-model="alert.$state.personalItem.personalIdNumber"
              clearable
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
              v-model="alert.$state.personalItem.PersonalIDDateIssued"
              clearable
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
              v-model="alert.$state.personalItem.personalBirthDate"
              clearable
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
              v-model="alert.$state.personalItem.personalEthnic"
              clearable
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

        <!-- 👉 Code -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Code
            </VLabel>
            <VAutocomplete
              v-model="alert.$state.personalItem.PersonalCode"
              clearable
              :items="countriesArr"
              :rules="[requiredValidator]"
              :item-value="(item) => getCountryCode(item)"
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
              v-model="alert.$state.personalItem.personalGender"
              clearable
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
              v-model="alert.$state.personalItem.personalResidencyCardID"
              clearable
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
              v-model="alert.$state.personalItem.personalPhoneNumber"
              clearable
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
              v-model="alert.$state.personalItem.personalPhoneNumber2"
              clearable
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
              v-model="alert.$state.personalItem.PersonalEmail"
              clearable
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
              v-if="(!formDisabled && can('update', 'personal')) || (!personalId && can('create', 'personal'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'personal') && personalId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
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

