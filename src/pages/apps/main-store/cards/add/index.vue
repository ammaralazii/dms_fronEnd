<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { requiredValidator } from '@validators'
import filterNull from '@/helper/filterNull'

const emit = defineEmits(['update:isDrawerAddcardOpen'])

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)

const cardFields = ref<any>({
  ContrNo: '',
  SubNo: '',
  CRM_ACCT_Code: '',
  PrePostPaid: '',
  CradStatus: '',
  SubStateReson: '',
  ActiveDate: '',
  TreiffProfile: '',
  CardName: '',
  CardNo: '',
  ICCID: '',
  CardRecivedDate: '',
  CardImportDate: '',
  StatusLVN: '',
})

// /props

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
  return { enableTime: true, dateFormat: 'Y-m-d H:i' }
})

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    let result = null
    result = await baseService.create('card', filterNull(cardFields.value)) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'card added successfly .'

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
  <VSheet
    class="mx-auto pa-4"
    height="auto"
  >
    <strong
      class="pa-3"
      style="text-decoration: underline;"
    >
      Add New card
    </strong>
    <VForm
      ref="refForm"
      v-model="isFormValid"
      class="mt-3"
      @submit.prevent="onSubmit"
    >
      <VRow>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Contr Number
          </VLabel>
          <VTextField
            v-model="cardFields.ContrNo"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Subnumber
          </VLabel>
          <VTextField
            v-model="cardFields.SubNo"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            CRM ACCT Code
          </VLabel>
          <VTextField
            v-model="cardFields.CRM_ACCT_Code"
          />
        </VCol>

        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            PrePost Paid
          </VLabel>
          <VTextField
            v-model="cardFields.PrePostPaid"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Status
          </VLabel>
          <VTextField
            v-model="cardFields.CradStatus"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            SubState Reson
          </VLabel>
          <VTextField
            v-model="cardFields.SubStateReson"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Active Date
          </VLabel>
          <AppDateTimePicker
            v-model="cardFields.ActiveDate"
            :conf="dateTimePickerConfig"
            append-inner-icon="ph-calendar"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Treiff Profile
          </VLabel>
          <VTextField
            v-model="cardFields.TreiffProfile"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Card Name
          </VLabel>
          <VTextField
            v-model="cardFields.CardName"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Card Number
          </VLabel>
          <VTextField
            v-model="cardFields.CardNo"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            ICCID
          </VLabel>
          <VTextField
            v-model="cardFields.ICCID"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel class="required">
            Recived Date
          </VLabel>
          <AppDateTimePicker
            v-model="cardFields.CardRecivedDate"
            :conf="dateTimePickerConfig"
            append-inner-icon="ph-calendar"
            :rules="[requiredValidator]"
          />
        </VCol>
      </VRow>

      <VRow>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel class="required">
            Import Date
          </VLabel>
          <AppDateTimePicker
            v-model="cardFields.CardImportDate"
            :conf="dateTimePickerConfig"
            append-inner-icon="ph-calendar"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Costomer Group
          </VLabel>
          <VTextField
            v-model="cardFields.CostomerGroup"
          />
        </VCol>
        <VCol
          cols="12"
          lg="3"
          md="3"
          sm="12"
          ms="12"
        >
          <VLabel>
            Status LVN
          </VLabel>
          <VTextField
            v-model="cardFields.StatusLVN"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VBtn
            type="submit"
            class="mt-3"
            :loading="loading"
          >
            Add
          </VBtn>
        </VCol>
      </VRow>
    </VForm>
  </VSheet>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

