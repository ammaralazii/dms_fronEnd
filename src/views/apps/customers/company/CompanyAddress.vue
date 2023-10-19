<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { companyAdress } from '@/types/interfaces/company-address'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  companyId: {
    required: true,
  },
})

const emit = defineEmits(['addedAddress'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const companyAddressItem = ref()
const companyAddress = ref<companyAdress>()
const LoadingForGetData = ref(true)

const alert = useAlertsStore()
const comPnId = ref(route.params.id || props.companyId)

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
  console.log('props.companyId : ', props.companyId)

  if (props.companyId)
    formDisabled.value = false

  if (comPnId.value) {
    const item = await baseService.get(`getByCompanyId/${comPnId.value}`) as any

    if (item.success) {
      companyAddress.value = item.data ? item.data : {}
      LoadingForGetData.value = false
    }
  }
  else {
    companyAddress.value = {}
    LoadingForGetData.value = false
  }// /if
})// /onMounted

const onSubmit = async () => {
  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    companyAddressItem.value = { ...companyAddress.value }

    let result = null

    if (companyAddress.value.company_id) {
      delete companyAddressItem.value.company_id
      result = await baseService.update('company_address', filterNull(companyAddressItem.value), companyAddressItem.value.CompanyAddressId) as any
      payload.text = 'the address updated successfly .'
    }
    else {
      companyAddress.value.company_id = comPnId.value
      companyAddressItem.value.company_id = comPnId.value
      result = await baseService.create('company_address', filterNull(companyAddressItem.value)) as any
      payload.text = 'the address added successfly .'
    }
    loading.value = false
    if (result.success) {
      payload.color = 'success'
      alert.$state.tosts.push(payload)
      nextTick(() => {
        refForm.value?.reset()
        refForm.value?.resetValidation()
        comPnId.value = null
        formDisabled.value = true
        emit('addedAddress')
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
    <VAlert
      v-if="companyId === null"
      variant="outlined"
      type="warning"
      prominent
      border="top"
      height="80px"
    >
      The process of filling out the information is sequential .
    </VAlert>
    <VForm
      ref="refForm"
      v-model="isFormValid"
      class="mt-3"
      :disabled="formDisabled"
      @submit.prevent="onSubmit"
    >
      <VRow>
        <!-- 👉  Street Address Line1 -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Street Address Line1
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressStreetAddressLine1"
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

        <!-- 👉 Street Address Line2 -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Street Address Line2
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressStreetAddressLine2"
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

        <!-- 👉 City -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              City
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressCity"
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

        <!-- 👉 Suburb -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Suburb
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressSuburb"
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

        <!-- 👉 Province -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Province
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressProvince"
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

        <!-- 👉 Postcode  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Postcode
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressPostcode"
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

        <!-- 👉 Telephone (H)  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Telephone (H)
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressTelephoneH"
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

        <!-- 👉 Telephone (W)  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Telephone (W)
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressTelephoneW"
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

        <!-- 👉 P.O. Box  -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              P.O. Box
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressPOBox"
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

        <!-- 👉 Email  -->
        <VCol
          cols="12"
          xl="3"
          md="3"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Email
            </VLabel>
            <VTextField
              v-model="companyAddress.CompanyAddressEmail"
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
              v-if="!formDisabled && (can('update', 'company_address') && !companyId) || (companyId && can('create', 'company_address'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'company_address') && !companyId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit company Address
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

