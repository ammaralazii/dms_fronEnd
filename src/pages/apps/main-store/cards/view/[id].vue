<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import FileDialog from '@/views/apps/devices/FileDialog.vue'
import GetBackFiles from '@/views/apps/devices/view/GetBackFiles.vue'

const emit = defineEmits(['update:isDrawerAddDeviceOpen'])
const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const isFileDrawerVisible = ref(false)
const files = ref([])
const dialog = ref(false)

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit)

const cardId = route.params.id || ''

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

const alert = useAlertsStore()

onMounted(async () => {
  if (cardId) {
    const carddata = await baseService.get(`card/${cardId}`) as any

    if (carddata.data)
      cardFields.value = carddata.data
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
  return { enableTime: true, dateFormat: 'Y-m-d H:i' }
})

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    console.log('cardFields : ', cardFields.value)
    let result = null
    result = await baseService.update('card', cardFields.value, cardId as string) as any

    loading.value = false
    if (result.success) {
      payload.color = 'success'
      payload.text = 'device added successfly .'

      alert.$state.tosts.push(payload)
    }// /if
  }// /validation
}// /onSubmit
</script>

<template>
  <div>
    <VSheet
      class="mx-auto pa-4"
      height="auto"
    >
      <strong
        class="pa-3"
        style="text-decoration: underline;"
      >
        Card Details
      </strong>
      <VForm
        ref="refForm"
        v-model="isFormValid"
        class="mt-3"
        :disabled="formDisabled"
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
            <VLabel class="required">
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
              v-if="!formDisabled && can('update', 'card')"
              type="submit"
              class="mt-3"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'card')"
              class="mt-3 mx-3"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit Card
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VSheet>

    <FileDialog
      v-model:isDrawerFileOpen="isFileDrawerVisible"
      :files="files"
      :device_attachment="device_attachment"
    />
    <GetBackFiles :dialog="dialog" />
  </div>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

