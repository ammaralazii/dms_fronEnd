<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { workPermitInfo } from '@/types/interfaces/workPermit-info'
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

const emit = defineEmits(['addedWorkPermit'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const work_permitItem = ref()
const work_permit = ref<workPermitInfo>()
const LoadingForGetData = ref(true)

const alert = useAlertsStore()
const foRnId = ref(route.params.id || props.foreignId)

const urlId = route.params.id

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

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
    const item = await baseService.get(`work_permit/getByForeignId/${foRnId.value}`) as any

    if (item.success) {
      work_permit.value = item.data ? item.data : {}
      LoadingForGetData.value = false
    }
  }
  else {
    work_permit.value = {}
    LoadingForGetData.value = false
  }// /if
})// /onMounted

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    work_permitItem.value = { ...work_permit.value }

    let result = null

    if (work_permit.value.foreign_id) {
      delete work_permitItem.value.foreign_id
      result = await baseService.update('work_permit', filterNull(work_permitItem.value), work_permitItem.value.WorkPermitId) as any
      payload.text = 'the work permit updated successfly .'
    }
    else {
      work_permit.value.foreign_id = foRnId.value
      work_permitItem.value.foreign_id = foRnId.value
      result = await baseService.create('work_permit', filterNull(work_permitItem.value)) as any
      payload.text = 'the work permit added successfly .'
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
          emit('addedWorkPermit')
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
        <!-- 👉  Permit Number -->
        <VCol
          cols="12"
          xl="6"
          md="6"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Permit Number
            </VLabel>
            <VTextField
              v-model="work_permit.WorkPermitIdNumber"
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

        <!-- 👉 Date Issued -->
        <VCol
          cols="12"
          xl="6"
          md="6"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Date Issued
            </VLabel>
            <AppDateTimePicker
              v-model="work_permit.WorkPermitDateIssued"
              clearable
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
        <!-- 👉 Date Expire -->
        <VCol
          cols="12"
          xl="6"
          md="6"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Date Expire
            </VLabel>
            <AppDateTimePicker
              v-model="work_permit.WorkPermitDateExpire"
              clearable
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
      </VRow>

      <VRow>
        <VCol>
          <template v-if="!LoadingForGetData">
            <VBtn
              v-if="route.params.id && (can('update', 'work_permit') && (!formDisabled || JSON.parse(route.params.edit))) || (!route.params.id && can('create', 'work_permit'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'work_permit') && route.params.id"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit Work Permit
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

