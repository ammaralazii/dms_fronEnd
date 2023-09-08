<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import TableExport from 'tableexport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import type { UserProperties } from '@/@fake-db/types'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import UpdateUserData from '@/views/apps/user/list/UpdateUserData.vue'
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import { avatarText } from '@core/utils/formatters'
import { useAlertsStore } from '@/stores'
import type { roles } from '@/types/interfaces/roles'
import { baseService } from '@/api/BaseService'
import type { userInfo } from '@/types/interfaces/user-info'
import { user } from '@/types/enum/roles'

const alert = useAlertsStore()

// 👉 Store
const userListStore = useUserListStore()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalUsers = ref(0)
const users = ref<userInfo[]>([])
const oldList = ref()
const searchingItems = ref<any>([])

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchUsers()
})

// 👉 Fetching users
const fetchUsers = () => {
  userListStore.fetchUsers({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    if (response.data?.success) {
      users.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalUsers.value = response.data.data.total
    }// /if
  }).catch(error => {
    console.error(error)
  })
}

// watchEffect(fetchUsers)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

const rolesItems = computed(() => {
  return alert.$state.roles
})/* /tost */

// this computed to get cases from server
const casesItem = computed(() => {
  return alert.$state.cases
})// /roles

// const plans = [
//   { title: 'Basic', value: 'basic' },
//   { title: 'Company', value: 'company' },
//   { title: 'Enterprise', value: 'enterprise' },
//   { title: 'Team', value: 'team' },
// ]

const resolveUserRoleVariant = (role: string) => {
  if (role === 'super_admin')
    return { color: 'warning', icon: 'tabler-user' }
  if (role === 'admin')
    return { color: 'success', icon: 'ph-game-controller' }
  if (role === 'manager')
    return { color: 'primary', icon: 'tabler-chart-pie-2' }
  if (role === 'user')
    return { color: 'info', icon: 'ph-person' }

  return { color: 'primary', icon: 'ph-briefcase' }
}

const resolveUserStatusVariant = (stat: string) => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'

  return 'primary'
}

const isAddNewUserDrawerVisible = ref(false)
const isUpdateUserDrawerVisible = ref(false)
const userUpdateData = ref()

// 👉 open update user drawer
const openUpdateUserDrawer = (data: userInfo) => {
  isUpdateUserDrawerVisible.value = true
  userUpdateData.value = data
}// /openUpdateUserDrawer

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = users.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = users.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalUsers.value} entries`
})

// 👉 Add new user
const addNewUser = (userData: userInfo) => {
  if (
    (selectedRole.value === null || userData?.role?.RoleName === selectedRole.value)
  || (selectedStatus.value === null || userData?.user_case?.case === selectedStatus.value)
  )
    users.value.unshift(userData)

  oldList.value.unshift(userData)
}// /addNewUser

// update the user
const updateUser = (userData: userInfo) => {
  isUpdateUserDrawerVisible.value = false
  oldList.value = users.value
}// /updateUser

// 👉 delete the user
const deleteUser = async (item: any, index: number) => {
  const result = await baseService.delete('user', [item.id]) as any

  if (result.success) {
    users.value.splice(index, 1)

    const payload = {
      color: 'success',
      timeOut: 5000,
      run: true,
      text: 'تم حذف المستخدم',
      position: {
        top: true,
        right: false,
        left: false,
        bottom: false,
      },
      update: false,
    }/* /payload */

    alert.$state.tosts.push(payload)
  }// /if
}// /deleteUser

// 👉 Export To Excel
const exportToExcel = async () => {
  const myTable = document.getElementById('myTable') as HTMLElement
  const table = myTable.querySelector('table')

  if (table) {
    // Convert the table to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table)

    // Create a new workbook and add the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Generate the Excel file as an array buffer
    const arrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })

    // Convert the array buffer to a Blob
    const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    // Use FileSaver.js to trigger the download
    saveAs(blob, 'exported-data.xlsx')
  }
}// /exportToExcel

// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'Session',
    stats: totalUsers.value,
    percentage: +29,
    subtitle: 'Total Users',
  },
  {
    icon: 'tabler-user-plus',
    color: 'error',
    title: 'Paid Users',
    stats: '4,567',
    percentage: +18,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    title: 'Active Users',
    stats: '19,860',
    percentage: -14,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'warning',
    title: 'Pending Users',
    stats: '237',
    percentage: +42,
    subtitle: 'Last week analytics',
  },
]

const getItemsByRole = (val: any, changeStatus = false) => {
  if (!selectedStatus.value || changeStatus)
    users.value = oldList.value
  else
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getItemsByStatus(selectedStatus.value, true)

  if (val) {
    users.value = users.value.filter((item: any) => {
      if (item?.role?.RoleName === val)
        return item
    })// /map
  }// /if
}// /getItemByRole

const getItemsByStatus = (val: any, changeRole = false) => {
  if (!selectedRole.value || changeRole)
    users.value = oldList.value
  else
    getItemsByRole(selectedRole.value, true)

  if (val) {
    users.value = users.value.filter((item: any) => {
      if (item?.user_case?.case === val)
        return item
    })// /map
  }// /if
}// /getItemsByStatus

const searchInObject = (object: any, val: any) => {
  for (const key in object) {
    console.log('object[key] : ', object[key])
    // eslint-disable-next-line max-statements-per-line
    if (typeof object[key] === 'object') { searchInObject(object[key], val) }
    else {
      if (typeof object[key] === 'string' && object[key].includes(val))
        return true // If found, include the object in the results
    }// /if
  }// /for

  return false
}// /searchInObject

const getItemBySerchingValue = (val: any) => {
  searchingItems.value = []

  if (val) {
    users.value.forEach((item: any) => {
      // Check if the searchWord is present in any property (e.g., name)
      if (searchInObject(item, val))
        searchingItems.value.push(item)
    })// /filter
  }// /if
}// /getItemBySerchingValue

watch(() => searchQuery.value, (val: any) => {
  getItemBySerchingValue(val)
})// /watch

// 👉 filter by Roles
watch(() => selectedRole.value, (val: any) => {
  getItemsByRole(val)
})// /watch

// 👉 filter by Stuts
watch(() => selectedStatus.value, (val: any) => {
  getItemsByStatus(val)
})// /watch
</script>

<template>
  <section>
    <VRow>
      <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
      >
        <VCard>
          <VCardText class="d-flex justify-space-between">
            <div>
              <span>{{ meta.title }}</span>
              <div class="d-flex align-center gap-2 my-1">
                <h6 class="text-h6">
                  {{ meta.stats }}
                </h6>
                <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'">({{ meta.percentage }}%)</span>
              </div>
              <span>{{ meta.subtitle }}</span>
            </div>

            <VAvatar
              rounded
              variant="tonal"
              :color="meta.color"
              :icon="meta.icon"
            />
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedRole"
                  label="Select Role"
                  :items="rolesItems"
                  clearable
                  clear-icon="tabler-x"
                  :item-title="(item) => item.RoleName"
                />
              </VCol>
              <!-- 👉 Select Plan -->
              <VCol
                cols="12"
                sm="4"
                class="d-none"
              >
                <VSelect
                  v-model="selectedPlan"
                  label="Select Plan"
                  :items="[]"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>

              <!-- 👉 Select Status -->
              <VCol
                cols="12"
                sm="4"
              >
                <VSelect
                  v-model="selectedStatus"
                  label="Select Status"
                  :items="casesItem"
                  :item-title="(item) => item.case"
                  clearable
                  clear-icon="tabler-x"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <!-- 👉 Search  -->
              <div style="width: 10rem;">
                <VTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>
            </div>

            <VSpacer />

            <div class=" d-flex align-center flex-wrap gap-4">
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
                @click="exportToExcel"
              >
                Export
              </VBtn>

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New User
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VTable
            id="myTable"
            class="text-no-wrap"
          >
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">
                  USER
                </th>
                <th scope="col">
                  ROLE
                </th>
                <th
                  class="d-none"
                  scope="col"
                >
                  PLAN
                </th>
                <th
                  class="d-none"
                  scope="col"
                >
                  BILLING
                </th>
                <th scope="col">
                  STATUS
                </th>
                <th scope="col">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody v-if="users.length || searchingItems.length">
              <tr
                v-for="(user, index) in searchingItems.length > 0 || searchQuery.trim() !== '' ? searchingItems : users"
                :key="index"
                style="height: 3.75rem;"
              >
                <!-- 👉 User -->
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      :color="resolveUserRoleVariant(user.role).color"
                      class="me-3"
                      size="38"
                    >
                      <VImg
                        v-if="user.avatar"
                        :src="user.avatar"
                      />
                      <span v-else>{{ avatarText(user.fullName) }}</span>
                    </VAvatar>

                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <RouterLink
                          :to="{ name: 'apps-user-view-id', params: { id: user.id } }"
                          class="font-weight-medium user-list-name"
                        >
                          {{ user.username }}
                        </RouterLink>
                      </h6>
                      <span class="text-sm text-disabled">{{ user.email }}</span>
                    </div>
                  </div>
                </td>

                <!-- 👉 Role -->
                <td v-if="user.role?.RoleName">
                  <VAvatar
                    :color="resolveUserRoleVariant(user.role?.RoleName).color"
                    :icon="resolveUserRoleVariant(user.role?.RoleName).icon"
                    variant="tonal"
                    size="30"
                    class="me-4"
                  />
                  <span class="text-capitalize text-base">{{ user.role?.RoleName || "not found" }}</span>
                </td>
                <td v-else>
                  not found
                </td>

                <!-- 👉 Plan -->
                <td class="d-none">
                  <span class="text-capitalize text-base font-weight-semibold">{{ user.currentPlan }}</span>
                </td>

                <!-- 👉 Billing -->
                <td class="d-none">
                  <span class="text-base">{{ user.billing }}</span>
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="resolveUserStatusVariant(user.user_case?.case)"
                    size="small"
                    class="text-capitalize"
                  >
                    {{ user.user_case?.case }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="openUpdateUserDrawer(user)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteUser(user, index)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-trash"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-dots-vertical"
                    />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          title="View"
                          :to="{ name: 'apps-user-view-id', params: { id: user.id } }"
                        />
                        <VListItem
                          title="Suspend"
                          href="javascript:void(0)"
                        />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-if="!users.length">
              <tr>
                <td
                  colspan="7"
                  class="text-center"
                >
                  No data available
                </td>
              </tr>
            </tfoot>
          </VTable>

          <VDivider />

          <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
            <span class="text-sm text-disabled">
              {{ paginationData }}
            </span>

            <VPagination
              v-model="currentPage"
              size="small"
              :total-visible="5"
              :length="totalPage"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add New User -->
    <AddNewUserDrawer
      v-model:isDrawerOpen="isAddNewUserDrawerVisible"
      @user-data="addNewUser"
    />

    <UpdateUserData
      v-if="isUpdateUserDrawerVisible"
      v-model:is-drawer-open="isUpdateUserDrawerVisible"
      :user-update-data="userUpdateData"
      @user-data="updateUser"
    />
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
