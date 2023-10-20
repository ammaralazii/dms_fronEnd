<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { otherInformationInfo } from '@/types/interfaces/other-information-info'
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

const emit = defineEmits(['addedOtherInformation'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const otherInformationItem = ref()
const otherInformation = ref<otherInformationInfo>()
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
    const item = await baseService.get(`other_information/getByForeignId/${foRnId.value}`) as any

    if (item.success) {
      otherInformation.value = item.data ? item.data : {}
      LoadingForGetData.value = false
    }
  }
  else {
    otherInformation.value = {}
    LoadingForGetData.value = false
  }// /if
})// /onMounted

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    otherInformationItem.value = { ...otherInformation.value }

    let result = null

    if (otherInformation.value.foreign_id) {
      delete otherInformationItem.value.foreign_id
      result = await baseService.update('other_information', filterNull(otherInformationItem.value), otherInformationItem.value.OtherInformationId) as any
      payload.text = 'the other information updated successfly .'
    }
    else {
      otherInformation.value.foreign_id = foRnId.value
      otherInformationItem.value.foreign_id = foRnId.value
      result = await baseService.create('other_information', filterNull(otherInformationItem.value)) as any
      payload.text = 'the other information added successfly .'
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
          emit('addedOtherInformation')
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
        <!-- 👉  Passport Number -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Passport Number
            </VLabel>
            <VTextField
              v-model="otherInformation.OtherInformationPassportNumber"
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

        <!-- 👉 Brith -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Brith
            </VLabel>
            <VTextField
              v-model="otherInformation.OtherInformationBrith"
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
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Date Issued
            </VLabel>
            <AppDateTimePicker
              v-model="otherInformation.OtherInformationDateIssued"
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

        <!-- 👉 Permanent -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Permanent
            </VLabel>
            <VTextField
              v-model="otherInformation.OtherInformationPermanent"
              clearable
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

        <!-- 👉 Expire Date -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Expire Date
            </VLabel>
            <AppDateTimePicker
              v-model="otherInformation.OtherInformationExpireDate"
              clearable
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

        <!-- 👉 Country Issue  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Country Issue
            </VLabel>
            <VTextField
              v-model="otherInformation.OtherInformationCountryIssue"
              clearable
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

        <!-- 👉 Nationality  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Nationality
            </VLabel>
            <VTextField
              v-model="otherInformation.OtherInformationNationality"
              clearable
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
              v-if="!formDisabled && (can('update', 'other_information') && !foreignId) || (foreignId && can('create', 'other_information'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'other_information') && !foreignId"
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

