<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'
import sortByText from '@/helper/sortByText'

const emit = defineEmits(['foreignId'])

const route = useRoute()

const refForm = ref<VForm>()
const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const foreignItem = ref()
const LoadingForGetData = ref(true)
const codes = ref([])

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const foreignId = ref(route.params.id || '')

const foreign = ref<any>({
  foreignId: '',
})

const alert = useAlertsStore()

onMounted(async () => {
  codes.value = sortByText(await baseService.get('https://restcountries.com/v3.1/all') as any) as any

  if (foreignId.value) {
    const foreignItem = await baseService.get(`foreign/${foreignId.value}`) as any

    if (foreignItem.data) {
      foreign.value = foreignItem.data
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
    foreignItem.value = { ...foreign.value }

    let result = null
    if (foreignId.value) {
      result = await baseService.update('foreign', filterNull(foreignItem.value), foreignItem.value.CompanyId) as any
      if (result?.success)
        payload.text = 'foreign updated successfly .'
    }
    else {
      result = await baseService.create('foreign', filterNull(foreignItem.value)) as any
      if (result?.data) {
        payload.text = 'foreign added successfly .'
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
          emit('foreignId', result?.data.ForeignId)
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
        <!-- 👉 First Name -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              First Name
            </VLabel>
            <VTextField
              v-model="foreign.ForeignFirstName"
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

        <!-- 👉 Middle Name  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Middle Name
            </VLabel>
            <VTextField
              v-model="foreign.ForeignSecondName"
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

        <!-- 👉 Last Name -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Last Name
            </VLabel>
            <VTextField
              v-model="foreign.ForeignThirdName"
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

        <!-- 👉 Marital Status  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Marital Status
            </VLabel>
            <VTextField
              v-model="foreign.ForeignMaritalStatus"
              :rules="[requiredValidator]"
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
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Gender
            </VLabel>
            <VAutocomplete
              v-model="foreign.ForeignGender"
              :items="gender"
              :rules="[requiredValidator]"
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

        <!-- 👉 Code -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Code
            </VLabel>
            <VAutocomplete
              v-model="foreign.code"
              :items="codes"
              :item-title="(item) => item?.name?.common"
              :item-value="(item) => item.cca2"
              :rules="[requiredValidator]"
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

        <!-- 👉 Phone Number  -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Phone Number
            </VLabel>
            <VTextField
              v-model="foreign.ForeignPhoneNumber"
              :rules="[requiredValidator, integerValidator]"
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

        <!-- 👉 Phone Number 2 -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel>
              Phone Number 2
            </VLabel>
            <VTextField
              v-model="foreign.ForeignPhoneNumber2"
              :rules="[integerValidator]"
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

        <!-- 👉 Email -->
        <VCol
          cols="12"
          xl="4"
          md="4"
          sm="12"
          xs="12"
        >
          <template v-if="!LoadingForGetData">
            <VLabel class="required">
              Email
            </VLabel>
            <VTextField
              v-model="foreign.ForeignEmail"
              :rules="[requiredValidator, emailValidator]"
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
              v-if="(!formDisabled && can('update', 'foreign')) || (!foreignId && can('create', 'foreign'))"
              type="submit"
              class="mt-3 mx-0"
              :loading="loading"
              :disabled="formDisabled"
            >
              Save
            </VBtn>

            <VBtn
              v-if="can('update', 'foreign') && foreignId"
              :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
              color="error"
              @click="formDisabled = !formDisabled"
            >
              Edit foreign
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

