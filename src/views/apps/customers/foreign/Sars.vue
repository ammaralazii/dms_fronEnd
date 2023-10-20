<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { sarsInfo } from '@/types/interfaces/sars-info'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  foreignId: {
    required: true,
  },
})

const emit = defineEmits(['addedSars'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const sarsItem = ref()
const sars = ref<sarsInfo>()
const LoadingForGetData = ref(true)

const alert = useAlertsStore()
const foRnId = ref(route.params.id || props.foreignId)

const urlId = route.params.id

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

onMounted(async () => {
  if (props.foreignId)
    formDisabled.value = false

  if (foRnId.value) {
    const item = await baseService.get(`sars/getByForeignId/${foRnId.value}`) as any

    if (item.success) {
      sars.value = item.data ? item.data : {}
      LoadingForGetData.value = false
    }
  }
  else {
    sars.value = {}
    LoadingForGetData.value = false
  }// /if
})// /onMounted

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    sarsItem.value = { ...sars.value }

    let result = null

    if (sars.value.foreign_id) {
      delete sarsItem.value.foreign_id
      result = await baseService.update('sars', filterNull(sarsItem.value), sarsItem.value.CompanyAddressId) as any
      payload.text = 'the SARS updated successfly .'
    }
    else {
      sars.value.foreign_id = foRnId.value
      sarsItem.value.foreign_id = foRnId.value
      result = await baseService.create('sars', filterNull(sarsItem.value)) as any
      payload.text = 'the SARS added successfly .'
    }
    loading.value = false
    if (result.success) {
      payload.color = 'success'
      alert.$state.tosts.push(payload)
      if (!urlId) {
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          foRnId.value = null
          formDisabled.value = true
          emit('addedSars')
        })
      }
    }// /if
  }// /validation
}// /onSubmit
</script>

<template>
  <VSheet
    class="mx-auto pa-4"
    height="auto"
  >
    <VAlert
      v-if="!foreignId"
      variant="outlined"
      type="warning"
      prominent
      border="top"
      height="80px"
    >
      Fill out the basic information for the client .
    </VAlert>
    <VForm
      ref="refForm"
      v-model="isFormValid"
      class="mt-3"
      :disabled="formDisabled"
      @submit.prevent="onSubmit"
    >
      <VRow>
        <!-- 👉  Tax Number -->
        <VCol
          cols="12"
          xl="6"
          md="6"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Tax Number
            </VLabel>
            <VTextField
              v-model="sars.SarsTaxNumber"
              clearable
            />
          </template>
          <template v-else>
            <Skeletor
              height="65px"
              pill
            />
          </template>
        </VCol>

        <!-- 👉 Office -->
        <VCol
          cols="12"
          xl="6"
          md="6"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Office
            </VLabel>
            <VTextField
              v-model="sars.SarsOffice"
              clearable
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
              v-if="!formDisabled && (can('update', 'sars') && !foreignId) || (foreignId && can('create', 'sars'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'sars') && !foreignId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit Other Information
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

