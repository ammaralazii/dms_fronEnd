<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  company_id: {
    required: true,
  },
})

const emit = defineEmits(['addedAuthorizedInfo'])

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

const alert = useAlertsStore()

onMounted(async () => {
  if (companyId.value) {
    const result = await baseService.get(`company/${companyId.value}`) as any

    if (result.data) {
      alert.$state.authorizedInfo = result.data
      LoadingForGetData.value = false
    }
  }
  else {
    if (props.company_id)
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
    companyItem.value = { ...alert.$state.authorizedInfo }

    let resulte = null
    if (companyId.value) {
      resulte = await baseService.update('authorized', filterNull(companyItem.value), companyItem.value.CompanyId) as any
      if (resulte?.success)
        payload.text = 'company updated successfly .'
    }
    else {
      companyItem.value.company_id = props.company_id
      resulte = await baseService.create('authorized', filterNull(companyItem.value)) as any
      if (resulte?.data) {
        payload.text = 'company added successfly .'
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          emit('addedAuthorizedInfo')
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
    <VAlert
      v-if="!company_id"
      variant="outlined"
      type="warning"
      prominent
      border="top"
      height="80px"
    >
      You must fill in company information first .
    </VAlert>

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
              v-model="alert.$state.authorizedInfo.CompanyName"
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
              v-model="alert.$state.authorizedInfo.CompanyBirthDate"
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
              v-model="alert.$state.authorizedInfo.CompanySAIDNumber"
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
              v-model="alert.$state.authorizedInfo.CompanyRelationship"
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
              v-model="alert.$state.authorizedInfo.CompanyGender"
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
              v-model="alert.$state.authorizedInfo.CompanyMedicallyDependent"
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

