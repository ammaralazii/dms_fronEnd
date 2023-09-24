<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import TableExport from 'tableexport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { ref } from 'vue'
import AddNewUserDrawer from '@/views/apps/user/list/AddNewUserDrawer.vue'
import UpdateUserData from '@/views/apps/user/list/UpdateUserData.vue'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import type { cardInfo } from '@/types/interfaces/card-info'

const alert = useAlertsStore()

// 👉 Store
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCards = ref(0)
const users = ref<userInfo[]>([])
const cards = ref<cardInfo[]>([])
const oldList = ref()
const searchingItems = ref<any>([])
const userCount = ref<number>()

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchCards()
})

// 👉 Fetching cards
const fetchCards = () => {
  alert.fetchCards({
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    if (response.data?.success) {
      cards.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalCards.value = response.data.data.total
      userCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  })
}// /fetchCards

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

const isAddNewUserDrawerVisible = ref(false)
const isUpdateUserDrawerVisible = ref(false)
const userUpdateData = ref()

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = cards.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = cards.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalCards.value} entries`
})

// 👉 Add new user
const addNewUser = (userData: userInfo) => {
  if (
    (selectedRole.value === null || userData?.role?.RoleName === selectedRole.value)
  || (selectedStatus.value === null || userData?.user_case?.case === selectedStatus.value)
  )
    cards.value.unshift(userData)
  if (userData?.user_case?.case === 'active')
    alert.$state.activeUserCount += 1
  alert.$state.userCount += 1
  oldList.value.unshift(userData)
}// /addNewUser

// update the user
const updateUser = (userData: userInfo) => {
  isUpdateUserDrawerVisible.value = false
  oldList.value = cards.value
}// /updateUser

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

const getItemsByRole = (val: any, changeStatus = false) => {
  if (!selectedStatus.value || changeStatus)
    cards.value = oldList.value
  else
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    getItemsByStatus(selectedStatus.value, true)

  if (val) {
    cards.value = cards.value.filter((item: any) => {
      if (item?.role?.RoleName === val)
        return item
    })// /map
  }// /if
}// /getItemByRole

const getItemsByStatus = (val: any, changeRole = false) => {
  if (!selectedRole.value || changeRole)
    cards.value = oldList.value
  else
    getItemsByRole(selectedRole.value, true)

  if (val) {
    cards.value = cards.value.filter((item: any) => {
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
    cards.value.forEach((item: any) => {
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
                prepend-icon="ph-arrow-square-out"
                @click="exportToExcel"
              >
                Export
              </VBtn>
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="ph-arrow-square-in"
              >
                Import
              </VBtn>

              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddNewUserDrawerVisible = true"
              >
                Add New Cards
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <PerfectScrollbar>
            <VTable
              id="myTable"
              class="text-no-wrap"
            >
              <!-- 👉 table head -->
              <thead>
                <tr>
                  <th scope="col">
                    Main box number
                  </th>
                  <th scope="col">
                    Secondary fund number
                  </th>
                  <th
                    class="d-none"
                    scope="col"
                  >
                    Serial number
                  </th>
                  <th
                    class="d-none"
                    scope="col"
                  >
                    MAC
                  </th>
                  <th scope="col">
                    FW version
                  </th>
                  <th scope="col">
                    Import date
                  </th>
                  <th scope="col">
                    Recived date
                  </th>
                  <th scope="col">
                    Agreement CMC
                  </th>
                  <th scope="col">
                    Agreement CMC
                  </th>
                  <th scope="col">
                    Attachment
                  </th>
                  <th scope="col">
                    Attachment
                  </th>
                  <th scope="col">
                    Type
                  </th>
                  <th scope="col">
                    Manufctur
                  </th>
                  <th scope="col">
                    Costomer group
                  </th>
                  <th scope="col">
                    Status LVN
                  </th>
                  <th scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <!-- 👉 table body -->
              <tbody v-if="cards.length > 0">
                <tr
                  v-for="(card, index) in cards"
                  :key="index"
                  style="height: 3.75rem;"
                >
                  <td>
                    {{ card.BoxNoMain || 'not found' }}
                  </td>
                  <td>
                    {{ card.BoxNoSub || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceSerialNumber || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceMAC || 'not found' }}
                  </td>
                  <td>
                    {{ card.FWVersion || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeciveImportDate || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceRecivedDate || 'not found' }}
                  </td>
                  <td>
                    {{ card.AgreementCMC || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceAttachment || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceType || 'not found' }}
                  </td>
                  <td>
                    {{ card.DeviceManufctur || 'not found' }}
                  </td>
                  <td>
                    {{ card.CostomerGroup || 'not found' }}
                  </td>
                  <td>
                    {{ card.StatusLVN || 'not found' }}
                  </td>
                  <td
                    class="text-center"
                    style="width: 5rem;"
                  >
                    <VBtn
                      icon
                      size="x-small"
                      color="default"
                      variant="text"
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
                    >
                      <VIcon
                        size="22"
                        icon="tabler-trash"
                      />
                    </VBtn>
                  </td>
                </tr>
              </tbody>

              <!-- 👉 table footer  -->
              <tfoot v-if="cards.length === 0">
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
          </PerfectScrollbar>

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
