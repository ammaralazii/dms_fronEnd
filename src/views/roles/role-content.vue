<script setup lang="ts">
import prmissionStructuer from '@/helper/prmissionStructuer'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import checkPermission from '@/helper/checkPermission'
import loadOldCheckedPermission from '@/helper/loadOldCheckedPermission'

const permissions = ref<any>([])
const hasPermission = ref<any>([])

const alert = useAlertsStore()
const route = useRoute()
const newCheckedItems = ref<any>([])
const loading = ref(false)
const checkIfYouCan = ref(false)

let roleName = route.path.split('/')[route.path.split('/').length - 1]

roleName = roleName === 'super-admin' ? 'super_admin' : roleName

onMounted(async () => {
  permissions.value = prmissionStructuer(await alert.fetchPermissions())
  hasPermission.value = await baseService.get(`role/${roleName}`)
  if (hasPermission.value.success && hasPermission.value.data[0]?.permissions?.length > 0)
    permissions.value = checkPermission(permissions.value, hasPermission.value.data) as any
})

const handleCheckboxClick = ($e: any, permission: any) => {
  // Toggle the value of checkboxes within the permission
  permission.checkboxes.forEach((checkbox: any) => {
    checkbox.value = !permission.allChecked

    if (!permission.allChecked) {
      // If allChecked is false and the checkbox id is not already in newCheckedItems, add it
      if (!newCheckedItems.value.includes(checkbox.id))
        newCheckedItems.value.push(checkbox.id)
    }
    else {
      // If allChecked is true, remove the checkbox id from newCheckedItems
      newCheckedItems.value = newCheckedItems.value.filter((item: any) => item !== checkbox.id)
    }
  })

  checkIfYouCan.value = true
  $e.stopPropagation()
}

const individualChecked = (event: any, permissionId: any, checkboxIndex: any) => {
  if (event.target.checked && !newCheckedItems.value.includes(permissionId))
    newCheckedItems.value.push(permissionId)

  else if (!event.target.checked && newCheckedItems.value.includes(permissionId))
    newCheckedItems.value = newCheckedItems.value.filter((item: any) => item !== permissionId)
  checkIfYouCan.value = true
}

const saveData = async () => {
  loading.value = true

  console.log('loadOldCheckedPermission : ', loadOldCheckedPermission(newCheckedItems.value, permissions.value))

  const result = await baseService.update('role', {
    permissions: loadOldCheckedPermission(newCheckedItems.value, permissions.value),
  }, roleName) as any

  loading.value = false
  if (result.success) {
    const payload = {
      color: 'success',
      timeOut: 5000,
      run: true,
      text: 'تم تعديل الصلاحيات',
      position: {
        top: true,
        right: false,
        left: false,
        bottom: false,
      },
      update: false,
    }/* /payload */

    alert.$state.tosts.push(payload)
  }
}// /saveData
</script>

<template>
  <VExpansionPanels>
    <VExpansionPanel
      v-for="(permission, permissionIndex) in permissions"
      :key="permissionIndex"
    >
      <VExpansionPanelTitle
        v-if="permission"
        expand-icon="mdi-menu-down"
      >
        <VCheckbox
          v-model="permission.allChecked"
          :label="permission.title"
          @click="handleCheckboxClick($event, permission)"
        />
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <VCheckbox
          v-for="(checkbox, checkboxIndex) in permission.checkboxes"
          :key="checkboxIndex"
          v-model="checkbox.value"
          :label="checkbox.title"
          @input="individualChecked($event, checkbox.id, checkboxIndex)"
        />
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
  <!-- Footer -->
  <VFooter class="mt-2">
    <VBtn
      v-if="permissions.length > 0"
      :loading="loading"
      color="primary"
      :disabled="checkIfYouCan ? false : true"
      @click="saveData"
    >
      Save
    </VBtn>
  </VFooter>
</template>

<style scoped>
/* Add your scoped styles here */
</style>
