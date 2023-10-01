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

const props = defineProps({
  isDrawerOpen: {
    required: true,
    type: Boolean,
  },
  // eslint-disable-next-line vue/require-prop-types
  userUpdateData: {
    required: true,
  },
})

const emit = defineEmits<Emit>()

const isFormValid = ref(false)
const refForm = ref<VForm>()
const password = ref()

const showPassword = ref(false)

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
  showPassword.value = !showPassword.value
}// /togglePasswordVisibility

const userData = ref(props.userUpdateData as any) as userInfo

// this function o submit reqest
const onSubmit = () => {
  refForm.value?.validate().then(async ({ valid }) => {
    if (valid) {
      const user = {
        username: userData.value?.username,
        email: userData.value?.email,
        role_id: userData.value?.role?.RoleId,
        case_id: userData.value?.user_case?.UserCaseId,
      }// /userData

      if (password.value !== undefined)
        userData.password = password.value

      let resultUpdateUser = null
      resultUpdateUser = await baseService.update('user', user, userData.value.id as string) as any

      if (resultUpdateUser.success) {
        if (userData.value.user_case.case === 'active')
          alert.$state.activeUserCount += 1
        else
          alert.$state.activeUserCount -= 1

        const payload = {
          color: 'success',
          timeOut: 5000,
          run: true,
          text: 'تم تعديل المستخدم',
          position: {
            top: true,
            right: false,
            left: false,
            bottom: false,
          },
          update: false,
        }/* /payload */

        alert.$state.tosts.push(payload)
        emit('update:isDrawerOpen', false)
        nextTick(() => {
          refForm.value?.reset()
          refForm.value?.resetValidation()
        })// nextTick
      }// /if
    }// /if
  })// refValidate
}// /onSubmit

// /this function to close navigation drwaer whenclick on overlay
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
        Update User
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
              <!-- 👉 username -->
              <VCol cols="12">
                <VTextField
                  v-model="userData.username"
                  :rules="[requiredValidator]"
                  label="username"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol cols="12">
                <VTextField
                  v-model="userData.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                />
              </VCol>

              <!-- 👉 Role -->
              <VCol cols="12">
                <VSelect
                  v-model="userData.role"
                  label="Select Role"
                  :items="roles"
                  :item-title="(item) => item.RoleName"
                  :item-value="(item) => item"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol cols="12">
                <VSelect
                  v-model="userData.user_case"
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
                  :rules=" [passwordValidator]"
                  @click:append-inner="togglePasswordVisibility"
                />
              </VCol>

              <!-- 👉 Submit and Cancel -->
              <VCol cols="12">
                <VBtn
                  type="submit"
                  class="me-3"
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
