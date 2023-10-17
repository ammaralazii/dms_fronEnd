<script setup lang="ts">
import { VForm } from 'vuetify/components'
import type { personalAdress } from '@/types/interfaces/personal-address'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const personalAddressItem = ref()
const personalAddress = ref()
const LoadingForGetData = ref(true)

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

onMounted(async () => {
  if (props.id) {
    const item = await baseService.get(`getByPersonalId/${props.id}`) as any

    if (item.data) {
      personalAddress.value = item.data
      LoadingForGetData.value = false
    }
  }
})

const onSubmit = async () => {
  console.log('personalAddress.value : ', personalAddress.value)

  const validate = await refForm.value?.validate() as any
  if (validate.valid
  ) {
    loading.value = true

    delete personalAddress.value.personal_id

    personalAddressItem.value = { ...personalAddress.value }

    let result = null
    result = await baseService.update('personal_address', filterNull(personalAddressItem.value), personalAddressItem.value.PersonalAddressId) as any
    loading.value = false
    if (result.success) {
      payload.color = 'success'

      payload.text = 'the address updated successfly .'

      alert.$state.tosts.push(payload)
    }// /if
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
        <!-- 👉  Street Address Line1 -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Street Address Line1
            </VLabel>
            <VTextField
              v-model="personalAddress.PersonalAddressStreetAddressLine1"
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
              v-model="personalAddress.PersonalAddressStreetAddressLine2"
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
            <VLabel class="required">
              City
            </VLabel>
            <VTextField
              v-model="personalAddress.personalAddressCity"
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
              v-model="personalAddress.personalAddressSuburb"
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
              v-model="personalAddress.personalAddressProvince"
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
              v-model="personalAddress.personalAddressPostCode"
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
              v-model="personalAddress.persnoalAddressPOBox"
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
              v-if="!formDisabled && can('update', 'personal_address')"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'personal_address')"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit personalAddress
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

