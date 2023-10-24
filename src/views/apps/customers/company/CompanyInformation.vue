<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'

const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  personal_id: {
    required: true,
    type: String,
  },
})

const emit = defineEmits(['companyId'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const companyItem = ref()
const LoadingForGetData = ref(true)

const companyId = ref(route.params.id || '')

const alert = useAlertsStore()

onMounted(async () => {
  if (companyId.value) {
    const result = await baseService.get(`company/${companyId.value}`) as any

    if (result.data) {
      alert.$state.companyInfo = result.data
      LoadingForGetData.value = false
    }
  }
  else {
    if (props.personal_id)
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

    alert.$state.companyInfo.personal_id = props.personal_id
    companyItem.value = { ...alert.$state.companyInfo }

    let resulte = null as any
    if (companyId.value) {
      resulte = await baseService.update('company', filterNull(companyItem.value), companyItem.value.CompanyId) as any
      if (resulte?.success)
        payload.text = 'company updated successfly .'
    }
    else {
      resulte = await baseService.create('company', filterNull(companyItem.value)) as any
      if (resulte?.data) {
        payload.text = 'company added successfly .'
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          emit('companyId', resulte?.data.CompanyId)
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
      v-if="!companyId"
      variant="outlined"
      type="warning"
      prominent
      border="top"
      height="80px"
    >
      You must fill in company personal first .
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
          xl="12"
          md="12"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Company Name
            </VLabel>
            <VTextField
              v-model="alert.$state.companyInfo.CompanyName"
            />
          </template>
          <template v-else>
            <Skeletor
              height="65px"
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

