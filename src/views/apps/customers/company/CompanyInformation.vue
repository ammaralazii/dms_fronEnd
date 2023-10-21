<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'

const emit = defineEmits(['companyId'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const companyItem = ref()
const LoadingForGetData = ref(true)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const companyId = ref(route.params.id || '')

const company = ref<any>({
  companyId: '',
})

const alert = useAlertsStore()

onMounted(async () => {
  if (companyId.value) {
    const companyItem = await baseService.get(`company/${companyId.value}`) as any

    if (companyItem.data) {
      company.value = companyItem.data
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

const dateTimePickerConfig = computed(() => {
  return { enableTime: true, dateFormat: 'Y-m-d' }
})

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    companyItem.value = { ...company.value }

    let result = null
    if (companyId.value) {
      result = await baseService.update('company', filterNull(companyItem.value), companyItem.value.CompanyId) as any
      if (result?.success)
        payload.text = 'company updated successfly .'
    }
    else {
      result = await baseService.create('company', filterNull(companyItem.value)) as any
      if (result?.data) {
        payload.text = 'company added successfly .'
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          emit('companyId', result?.data.CompanyId)
        })
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
        <!-- 👉 Name -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Name
            </VLabel>
            <VTextField
              v-model="company.CompanyName"
            />
          </template>
          <template v-else>
            <Skeletor
              height="65px"
              pill
            />
          </template>
        </VCol>

        <!-- 👉 Birth Date -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Birth Date
            </VLabel>
            <AppDateTimePicker
              :key="JSON.stringify(dateTimePickerConfig)"
              v-model:model-value="company.CompanyBirthDate"
              :config="dateTimePickerConfig"
              append-inner-icon="ph-calendar"
            />
          </template>
          <template v-else>
            <Skeletor
              height="65px"
              pill
            />
          </template>
        </VCol>

        <!-- 👉 SA I.D Number -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              SA I.D Number
            </VLabel>
            <VTextField
              v-model="company.CompanySAIDNumber"
            />
          </template>
          <template v-else>
            <Skeletor
              height="65px"
              pill
            />
          </template>
        </VCol>

        <!-- 👉 Relationship -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Relationship
            </VLabel>
            <VTextField
              v-model="company.CompanyRelationship"
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

        <!-- 👉 Gender -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Gender
            </VLabel>
            <VAutocomplete
              v-model="company.CompanyGender"
              :items="gender"
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

        <!-- 👉 Medically Dependent  -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
          class="d-flex align-center mt-5"
        >
          <template v-if="!LoadingForGetData">
            <VCheckbox
              v-model="company.CompanyMedicallyDependent"
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
              v-if="(!formDisabled && can('update', 'company')) || (!companyId && can('create', 'company'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'company') && companyId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit company
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

