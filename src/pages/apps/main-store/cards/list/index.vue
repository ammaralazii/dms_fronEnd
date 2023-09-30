<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import TableExport from 'tableexport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

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
const cards = ref<cardInfo[]>([])
const oldList = ref()
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
    console.log('response : ', response)
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

// 👉 Computing pagination dat
const paginationData = computed(() => {
  const firstIndex = cards.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = cards.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalCards.value} entries`
})

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

          <VTable
            id="myTable"
            class="text-no-wrap"
          >
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">
                  Code
                </th>
                <th scope="col">
                  Contr Number
                </th>
                <th scope="col">
                  Subnumber
                </th>
                <th scope="col">
                  CRM ACCT Code
                </th>
                <th
                  class="d-none"
                  scope="col"
                >
                  Prepost Paid
                </th>
                <th
                  class="d-none"
                  scope="col"
                >
                  Status
                </th>
                <th scope="col">
                  Substate Reson
                </th>
                <th scope="col">
                  Active Date
                </th>
                <th scope="col">
                  Treiff Profile
                </th>
                <th scope="col">
                  Card Name
                </th>
                <th scope="col">
                  Card Number
                </th>
                <th scope="col">
                  ICCID
                </th>
                <th scope="col">
                  Recived Date
                </th>
                <th scope="col">
                  Import Date
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
                  {{ card.CardCode || 'not found' }}
                </td>
                <td>
                  {{ card.ContrNo || 'not found' }}
                </td>
                <td>
                  {{ card.SubNo || 'not found' }}
                </td>
                <td>
                  {{ card.CRM_ACCT_Code || 'not found' }}
                </td>
                <td>
                  {{ card.PrePostPaid || 'not found' }}
                </td>
                <td>
                  {{ card.CradStatus || 'not found' }}
                </td>
                <td>
                  {{ card.SubStateReson || 'not found' }}
                </td>
                <td>
                  {{ card.ActiveDate || 'not found' }}
                </td>
                <td>
                  {{ card.TreiffProfile || 'not found' }}
                </td>
                <td>
                  {{ card.CardName || 'not found' }}
                </td>
                <td>
                  {{ card.CardNo || 'not found' }}
                </td>
                <td>
                  {{ card.ICCID || 'not found' }}
                </td>
                <td>
                  {{ card.CardRecivedDate || 'not found' }}
                </td>
                <td>
                  {{ card.CardImportDate || 'not found' }}
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
