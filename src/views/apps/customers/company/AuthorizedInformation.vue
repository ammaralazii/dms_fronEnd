<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { can } from '@layouts/plugins/casl'
import filterNull from '@/helper/filterNull'
import { gender } from '@/types/enum/gender'
import DeleteDialog from '@/views/base/DeleteDialog.vue'

const props = defineProps({
  // eslint-disable-next-line vue/require-prop-types
  company_id: {
    required: true,
  },
})

const emit = defineEmits(['addedAuthorizedInfo'])

const route = useRoute()

const refForm: any = [
]

const refForm2: any = [
]

const isFormValid = ref(false)
const loading = ref(false)
const formDisabled = ref(true)
const companyItem = ref()
const LoadingForGetData = ref(true)
const haveAuthrizedUser = ref(false)
const deleteItems = ref([])
const dialog = ref(false)
const expentionPenal = ref<any>([])

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const companyId = ref(route.params.id || '')

const alert = useAlertsStore()

onMounted(async () => {
  if (companyId.value) {
    const result = await baseService.get(`authorized/getByCompanyId/${companyId.value}`) as any

    if (result.data) {
      alert.$state.authorizedInfo = result.data
      LoadingForGetData.value = false
      haveAuthrizedUser.value = true

      alert.$state.authorizedInfo.forEach(item => {
        refForm.push(ref<VForm>())
      })
    }
    else {
      formDisabled.value = false
      LoadingForGetData.value = false
      haveAuthrizedUser.value = false
      refForm2.push(ref<VForm>())
    }// /if
  }
  else {
    if (props.company_id)
      formDisabled.value = false

    expentionPenal.value.push(0)
    haveAuthrizedUser.value = true
    LoadingForGetData.value = false
    refForm2.push(ref<VForm>())
  }// /if
})// /mounted

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

if (route.query.edit)
  formDisabled.value = !JSON.parse(route.query.edit as any)

const onSubmit = async (index: number) => {
  const validate = await refForm[index].value[0]?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    companyItem.value = { ...alert.$state.authorizedInfo[index] as any }

    let resulte = null

    resulte = await baseService.update('authorized', filterNull(companyItem.value), companyItem.value.AuthorizedId) as any
    if (resulte?.success) {
      payload.text = 'Authorized person updated successfly .'
      loading.value = false
      payload.color = 'success'
      alert.$state.tosts.push(payload)
    }
  }// /validation
}// /onSubmit

const AddItem = async (index: number) => {
  const validate = await refForm2[index].value[0]?.validate() as any
  if (validate.valid
  ) {
    loading.value = true
    companyItem.value = { ...alert.$state.newAuthorizedInfo[index] }

    let resulte = null
    companyItem.value.company_id = props.company_id
    resulte = await baseService.create('authorized', filterNull(companyItem.value)) as any
    if (resulte?.data) {
      payload.text = 'Authorized person added successfly .'
      payload.color = 'success'
      alert.$state.tosts.push(payload)

      if (companyId.value) {
        if (alert.$state.authorizedInfo.length > 0) {
          refForm.unshift(ref<VForm>())
          alert.$state.authorizedInfo.unshift(resulte?.data as never)
        }
        else {
          refForm.push(ref<VForm>())
          alert.$state.authorizedInfo = [resulte?.data as never] as never
        }
        alert.$state.newAuthorizedInfo.splice(index, 1)
        refForm2.splice(index, 1)
      }
      else {
        nextTick(() => {
          refForm2[index].value[0]?.reset()
          refForm2[index].value[0]?.resetValidation()
          emit('addedAuthorizedInfo')
          alert.$state.newAuthorizedInfo.splice(index, 1)
        })
      }// /if
    }// /if
    loading.value = false
  }// /validation
}// /onSubmit

const deleteAuthorizedUser = (id: string | null) => {
  if (id) {
    deleteItems.value.push(id)
    dialog.value = true
  }// /id
}

const closeDeleteDialog = () => {
  deleteItems.value = []
  dialog.value = false
}// /deleteAuthorizedUser

const confermDeleteDialog = (ids?: any) => {
  deleteItems.value = []
  dialog.value = false
  ids.forEach((id: any) => {
    alert.$state.authorizedInfo = alert.$state.authorizedInfo.filter((item, index) => {
      if (item.AuthorizedId !== id)
        return item
      else
        refForm.splice(index, 1)
    })
  })
}// /confermDeleteDialog

const addNewItems = () => {
  formDisabled.value = false
  expentionPenal.value.unshift(expentionPenal.value.length)
  alert.$state.newAuthorizedInfo.unshift({})
  if (refForm2.length > 0)
    refForm2.unshift(ref<VForm>())
  else
    refForm2.push(ref<VForm>())
}// /addNewItems
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

    <VBtn
      v-if="haveAuthrizedUser"
      class="ma-2"
      variant="text"
      style="float: inline-end;"
      @click="addNewItems"
    >
      Add New Item
    </VBtn>

    <!-- Add new item -->
    <VExpansionPanels
      v-if="alert.$state.newAuthorizedInfo.length > 0"
      v-model="expentionPenal"
      multiple
    >
      <VExpansionPanel
        v-for="(item, key) in alert.$state.newAuthorizedInfo"
        :key="key"
      >
        <VExpansionPanelTitle class="text-capitalize">
          Authorized Information
          <template #actions="{ expanded }">
            <VIcon
              v-if="expanded"
              color="error"
              icon="ph-x"
              @click="() => {
                alert.$state.newAuthorizedInfo.splice(key, 1)
                refForm.splice(key, 1)
              }"
            />
            <VIcon
              v-else
              icon="ph-caret-down"
            />
          </template>
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm
            :ref="refForm2[key]"
            v-model="isFormValid"
            class="mt-3"
            :disabled="formDisabled"
            @submit.prevent="AddItem(key)"
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
                <VLabel>
                  Name
                </VLabel>
                <VTextField
                  v-model="item.AuthorizedName"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <!-- 👉 Birth Date -->
              <VCol
                cols="12"
                xl="3"
                md="3"
                sm="12"
                xs="12"
              >
                <VLabel>
                  Birth Date
                </VLabel>
                <AppDateTimePicker
                  v-model="item.AuthorizedBirthDate"
                  append-inner-icon="ph-calendar"
                />
              </VCol>

              <!-- 👉 SA I.D Number -->
              <VCol
                cols="12"
                xl="3"
                md="3"
                sm="12"
                xs="12"
              >
                <VLabel>
                  SA I.D Number
                </VLabel>
                <VTextField
                  v-model="item.AuthorizedSAIDNumber"
                />
              </VCol>

              <!-- 👉 Relationship -->
              <VCol
                cols="12"
                xl="3"
                md="3"
                sm="12"
                xs="12"
              >
                <VLabel>
                  Relationship
                </VLabel>
                <VTextField
                  v-model="item.AuthorizedRelationship"
                />
              </VCol>

              <!-- 👉 Gender -->
              <VCol
                cols="12"
                xl="3"
                md="3"
                sm="12"
                xs="12"
              >
                <VLabel>
                  Gender
                </VLabel>
                <VAutocomplete
                  v-model="item.AuthorizedGender"
                  :items="gender"
                />
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
                <VCheckbox
                  v-model="item.AuthorizedMedicallyDependent"
                  label="Medically Dependent"
                  color="primary"
                />
              </VCol>
            </VRow>

            <!-- 👉 Actions  -->
            <VRow>
              <VCol>
                <template v-if="!LoadingForGetData">
                  <VBtn
                    v-if=" (can('create', 'company')) "
                    type="submit"
                    class="mt-3 mx-0"
                    :loading="loading"
                    :disabled="formDisabled"
                  >
                    Save
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
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>

    <!-- Edit items -->
    <VExpansionPanels>
      <VExpansionPanel
        v-for="(item, key) in (alert.$state.authorizedInfo)"
        :key="key"
      >
        <VExpansionPanelTitle class="text-capitalize">
          {{ item.AuthorizedName || 'Add New Item' }}
        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VForm
            :ref="refForm[key]"
            v-model="isFormValid"
            class="mt-3"
            :disabled="formDisabled"
            @submit.prevent="onSubmit(key)"
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
                    v-model="item.AuthorizedName"
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
                    v-model="item.AuthorizedBirthDate"
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
                    v-model="item.AuthorizedSAIDNumber"
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
                    v-model="item.AuthorizedRelationship"
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
                    v-model="item.AuthorizedGender"
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
                    v-model="item.AuthorizedMedicallyDependent"
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

            <!-- 👉 Actions  -->
            <VRow>
              <VCol>
                <template v-if="!LoadingForGetData">
                  <VBtn
                    v-if="(route.params.id && (route.query.edit || !formDisabled) && can('update', 'company')) || (!route.params.id && can('create', 'company'))"
                    type="submit"
                    class="mt-3 mx-0"
                    :loading="loading"
                    :disabled="formDisabled"
                  >
                    Save
                  </VBtn>

                  <VBtn
                    v-if="(!formDisabled && can('delete', 'company')) && item.AuthorizedName"
                    class="mt-3 mx-2"
                    variant="outlined"
                    color="error"
                    :disabled="formDisabled"
                    @click="deleteAuthorizedUser(item.AuthorizedId)"
                  >
                    Delete
                  </VBtn>

                  <VBtn
                    v-if="can('update', 'company') && route.params.id"
                    :class=" !formDisabled ? 'mt-3 mx-3' : 'mt-3 mx-0'"
                    color="error"
                    @click="formDisabled = !formDisabled"
                  >
                    Edit Authorized Information
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
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VSheet>
  <DeleteDialog
    :dialog="dialog"
    :data="deleteItems"
    title="Delete Authorized Information"
    url="authorized"
    @close="closeDeleteDialog"
    @confirm="confermDeleteDialog"
  />
</template>

