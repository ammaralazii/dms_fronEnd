<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { VForm } from 'vuetify/components'
import { passwordValidator } from '@/utils/validators'

import type { userInfo } from '@/types/interfaces/user-info.ts'
import { emailValidator, requiredValidator } from '@validators'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'userData', value: userInfo): void
}

interface Props {
  isDrawerOpen: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const username = ref('')
const email = ref('')
const company = ref('')
const country = ref('')
const contact = ref('')
const roleId = ref()
const caseId = ref()
const plan = ref()
const password = ref()
const showPassword = ref(false)
const loading = ref(false)

const alert = useAlertsStore()

// 👉 drawer close
const closeNavigationDrawer = () => {
  emit('update:isDrawerOpen', false)

  nextTick(() => {
    refForm.value?.reset()
    refForm.value?.resetValidation()
  })
}

// this computed to get roles from server
const roles = computed(() => {
  return alert.$state.roles
})// /roles

// this computed to get cases from server
const cases = computed(() => {
  return alert.$state.cases
})// /roles

const togglePasswordVisibility = () => {
  console.log('function is working ...')
  showPassword.value = !showPassword.value
}// /togglePasswordVisibility

// this function o submit reqest
const onSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      loading.value = true

      const userData = {
        username: username.value,
        password: password.value,
        email: email.value,
        role_id: roleId.value.RoleId,
        case_id: caseId.value.UserCaseId,
      }

      const resultAddUser = await baseService.create('user', userData) as any

      loading.value = false
      if (resultAddUser.success) {
        const user = {
          id: resultAddUser.data.id,
          role: roleId.value,
          user_case: caseId.value,
          username: resultAddUser.data.username,
          email: resultAddUser.data.email,
        }// /user

        emit('userData', user)
        emit('update:isDrawerOpen', false)
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
        })
      }// /if
    }
  })
}// /onSubmit

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="400"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Title -->
    <div class="d-flex align-center pa-6 pb-1">
      <h6 class="text-h6">
        Add User
      </h6>

      <VSpacer />

      <!-- 👉 Close btn -->
      <VBtn
        variant="tonal"
        color="default"
        icon
        size="32"
        class="rounded"
        @click="closeNavigationDrawer"
      >
        <VIcon
          size="18"
          icon="tabler-x"
        />
      </VBTn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- 👉 Form -->
          <VForm
            ref="refForm"
            v-model="isFormValid"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- 👉 Full name -->
              <VCol cols="12">
                <VTextField
                  v-model="username"
                  :rules="[requiredValidator]"
                  label="username"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <VTextField
                  v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <!-- 👉 company -->
              <VCol
                cols="12"
                class="d-none"
              >
                <VTextField
                  v-model="company"
                  label="Company"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol
                cols="12"
                class="d-none"
              >
                <VTextField
                  v-model="country"
                  label="Country"
                />
              </VCol>

              <!-- 👉 Contact -->
              <VCol
                cols="12"
                class="d-none"
              >
                <VTextField
                  v-model="contact"
                  type="number"
                  label="Contact"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="12">
                <VSelect
                  v-model="roleId"
                  label="Select Role"
                  :items="roles"
                  :item-title="(item) => item.RoleName"
                  :item-value="(item) => item"
                />
              </VCol>

              <!-- 👉 Plan -->
              <VCol
                cols="12"
                class="d-none"
              >
                <VSelect
                  v-model="plan"
                  label="Select Plan"
                  :items="['Basic', 'Company', 'Enterprise', 'Team']"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="caseId"
                  label="Select Status"
                  :rules="[requiredValidator]"
                  :items="cases"
                  :item-title="(item) => item.case"
                  :item-value="(item) => item"
                />
              </VCol>

              <!-- 👉 password -->
              <VCol cols="12">
                <VTextField
                  v-model="password"
                  :append-inner-icon="showPassword ? 'ph-eye' : 'ph-eye-slash'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  :rules="[passwordValidator, requiredValidator]"
                  @click:append-inner="togglePasswordVisibility"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
                  :loading="loading"
                >
                  Submit
                </VBtn>
                <VBtn
                  type="reset"
                  variant="tonal"
                  color="secondary"
                  @click="closeNavigationDrawer"
                >
                  Cancel
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
