<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'
import sortByText from '@/helper/sortByText'
import { countriesArr, getCountryCode } from '@/types/enum/countries'

const emit = defineEmits(['foreignId'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const foreignItem = ref()
const LoadingForGetData = ref(true)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const foreignId = ref(route.params.id || '')

const alert = useAlertsStore()

onMounted(async () => {
  if (foreignId.value) {
    const resulte = await baseService.get(`foreign/${foreignId.value}`) as any

    if (resulte.data) {
      alert.$state.foreignInf = resulte.data
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

    foreignItem.value = { ...alert.$state.foreignInf }

    foreignItem.value.ForeignCode = getCountryCode(foreignItem.value.ForeignCode)

    let result: any = null
    if (foreignId.value) {
      result = await baseService.update('foreign', filterNull(foreignItem.value), foreignItem.value.ForeignId) as any
      if (result?.success) {
        payload.text = 'foreign updated successfly .'
        payload.color = 'success'
        alert.$state.tosts.push(payload)
      }
    }
    else {
      result = await baseService.create('foreign', filterNull(foreignItem.value)) as any
      if (result?.data) {
        payload.text = 'foreign added successfly .'
        payload.color = 'success'
        alert.$state.tosts.push(payload)
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          emit('foreignId', result?.data.ForeignId)
        })
      }
    }
    loading.value = false
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
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              First Name
            </VLabel>
            <VTextField
              v-model="alert.$state.foreignInf.ForeignFirstName"
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

        <!-- 👉 Middle Name  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Middle Name
            </VLabel>
            <VTextField
              v-model="alert.$state.foreignInf.ForeignSecondName"
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

        <!-- 👉 Last Name -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Last Name
            </VLabel>
            <VTextField
              v-model="alert.$state.foreignInf.ForeignThirdName"
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

        <!-- 👉 Gender -->
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
              v-model="alert.$state.foreignInf.ForeignGender"
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

        <!-- 👉 Code -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Code
            </VLabel>
            <VAutocomplete
              v-model="alert.$state.foreignInf.ForeignCode"
              clearable
              :items="countriesArr"
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

        <!-- 👉 Phone Number  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Phone Number
            </VLabel>
            <VTextField
              v-model="alert.$state.foreignInf.ForeignPhoneNumber"
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

        <!-- 👉 Phone Number 2 -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Phone Number 2
            </VLabel>
            <VTextField
              v-model="alert.$state.foreignInf.ForeignPhoneNumber2"
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
              v-model="alert.$state.foreignInf.ForeignEmail"
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

        <!-- 👉 Marital Status  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VCheckbox
              v-model="alert.$state.foreignInf.ForeignMaritalStatus"
              clearable
              class="mt-6"
              label="Medically Dependent"
              color="primary"
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
              v-if="(!formDisabled && can('update', 'foreign')) || (!foreignId && can('create', 'foreign'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'foreign') && foreignId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit foreign
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

