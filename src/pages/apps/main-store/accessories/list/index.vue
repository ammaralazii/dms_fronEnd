<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import TableExport from 'tableexport'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import DeleteDialog from '@/views/base/DeleteDialog.vue'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import type { accessoryInfo } from '@/types/interfaces/accessory-info'
import FilterDate from '@/views/base/FilterDate.vue'
import filterNull from '@/helper/filterNull'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const searchCode = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalaccessories = ref(0)
const accessories = ref<accessoryInfo[]>([])
const oldList = ref()
const userCount = ref<number>()
const loadaccessories = ref(false)
const selectedaccessories = ref([])
const selectAll = ref(false)
const deleteItems = ref([])
const dialog = ref(false)
const loadingUpload = ref(false)
const excelInput = ref()
const deviceId = ref()

const route = useRoute()

if (route.query.deviceId)
  deviceId.value = route.query.deviceId

const params = ref({
  perPage: rowPerPage.value,
  currentPage: currentPage.value,
  code: null,
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

// 👉 Fetching accessories
const fetchaccessories = () => {
  loadaccessories.value = true
  alert.fetchaccessories(filterNull(params.value)).then(response => {
    loadaccessories.value = false
    if (response.data?.success) {
      accessories.value = response.data.data.data
      console.log('accessories.value : ', accessories.value)
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalaccessories.value = response.data.data.total
      userCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  })
}// /fetchaccessories

// 👉 Fetching fetchaccessories device Id
const fetchaccessoriesById = () => {
  loadaccessories.value = true
  params.value.id = alert.$state.deviceId

  alert.fetchaccessoriesById(filterNull(params.value)).then(response => {
    console.log('response : ', response)
    loadaccessories.value = false
    if (response.data?.success) {
      accessories.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalaccessories.value = response.data.data.total
      userCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  })
}// /fetchaccessories

onMounted(() => {
  console.log('alert.$state.deviceId : ', alert.$state.deviceId)
  if (deviceId.value)
    fetchaccessoriesById()
  else
    fetchaccessories()
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination dat
const paginationData = computed(() => {
  const firstIndex = accessories.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = accessories.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalaccessories.value} entries`
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

// this function to add all accessory id to selectedaccessories
watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedaccessories.value = accessories.value.map(accessory => accessory.AccessoryId) as any
  else selectedaccessories.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedaccessories.value.length > 0 && selectedaccessories.value.length < accessories.value.length
})// /isIndeterminate

const selectAllaccessories = () => {
  if (!selectAll.value)
    selectedaccessories.value = []

  else
    selectedaccessories.value = accessories.value.map(accessory => accessory.AccessoryId) as any
}// /selectAllaccessories

// this function to delete accessories
const deleteaccessories = (ids?: any) => {
  if (selectedaccessories.value.length > 0)
    deleteItems.value = selectedaccessories.value
  else
    deleteItems.value.push(ids as never)
  dialog.value = true
}// /deleteaccessories

const closeDeleteDialog = () => {
  deleteItems.value = []
  dialog.value = false
}// /closeDeleteDialog

const confermDeleteDialog = (ids?: any) => {
  deleteItems.value = []
  dialog.value = false
  if (selectedaccessories.value.length > 0) {
    accessories.value = accessories.value.filter((item: any) => {
      if (!selectedaccessories.value.includes(item.AccessoryId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      accessories.value = accessories.value.filter(item => item.AccessoryId !== id)
    })
  }
}// /confermDeleteDialog

// this funnction to do filter on device table
const dataFiltering = (data: any) => {
  if (!data.type) {
    delete data.type
    delete params.value.type
  }
  if (deviceId.value)
    fetchaccessoriesById()
  else
    fetchaccessories()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  if (deviceId.value)
    fetchaccessoriesById()
  else
    fetchaccessories()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch

const openExcelDialog = () => {
  if (excelInput.value)
    excelInput.value.click()
}// /openExcelDialog

const uploadExcelFile = async (event: any) => {
  const excelFile = event.target.files[0]

  loadingUpload.value = true

  const formData = new FormData()

  formData.append('file', excelFile)

  let result = null
  result = await baseService.create('accessory/upload_excel', formData) as any

  loadingUpload.value = false

  if (result.success) {
    payload.color = 'success'
    payload.text = 'file uploaded successfly .'
    alert.$state.tosts.push(payload)
  }// /if
}// /uploadExcelFile

const goToEditPage = (id: string) => {
  router.push({
    name: 'apps-main-store-accessories-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const goToDevicePage = id => {
  router.push({
    name: 'apps-main-store-devices-view-id',
    params: {
      id,
    },
  })
}// /goToDevicePage
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <VCardText v-if="$can('get', 'accessory')">
            <FilterDate
              type="accessory"
              @dataFiltering="dataFiltering"
            />
          </VCardText>

          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <!-- 👉 Search  -->
              <div
                v-if="$can('get', 'accessory')"
                style="width: 10rem;"
              >
                <VTextField
                  v-model="searchCode"
                  placeholder="Search"
                  density="compact"
                  clearable
                />
              </div>
            </div>

            <VSpacer />

            <div class=" d-flex align-center flex-wrap gap-4">
              <!-- 👉 Export button -->
              <VBtn
                v-if="selectedaccessories.length > 0 && $can('delete', 'accessory')"
                variant="tonal"
                color="secondary"
                prepend-icon="ph-trash"
                @click="deleteaccessories"
              >
                Delete
              </VBtn>
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
                :loading="loadingUpload"
                @click="openExcelDialog"
              >
                Import
              </VBtn>
              <input
                ref="excelInput"
                type="file"
                hidden
                accept=".xlsx, .xls, .csv"
                @change="uploadExcelFile($event)"
              >

              <!-- 👉 Add user button -->
              <VBtn
                v-if="$can('create', 'accessory')"
                prepend-icon="tabler-plus"
                @click="$router.push('/apps/main-store/accessories/add')"
              >
                Add New accessories
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
          <VProgressLinear
            v-if="loadaccessories"
            color="primary"
            indeterminate
            reverse
          />

          <VTable
            id="myTable"
            class="text-no-wrap"
          >
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th
                  scope="col"
                  class="text-center"
                >
                  <!-- check all -->
                  <VCheckbox
                    v-model="selectAll"
                    :indeterminate="isIndeterminate"
                    @change="selectAllaccessories"
                  />
                </th>
                <th scope="col">
                  Code
                </th>
                <th scope="col">
                  Type
                </th>
                <th scope="col">
                  Serial Number
                </th>
                <th scope="col">
                  MAC
                </th>
                <th
                  scope="col"
                >
                  Manufctur
                </th>
                <th
                  scope="col"
                >
                  Import Date
                </th>
                <th scope="col">
                  Recive Date
                </th>
                <th scope="col">
                  Costomer Group
                </th>
                <th scope="col">
                  StatusLVN
                </th>
                <th scope="col">
                  device
                </th>
                <th
                  v-if="$can('update', 'accessory') || $can('delete', 'accessory')"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody v-if="accessories.length > 0">
              <tr
                v-for="(accessory, index) in accessories"
                :key="index"
                style="height: 3.75rem;"
              >
                <td>
                  <VCheckbox
                    v-model="selectedaccessories"
                    :value="accessory.AccessoryId"
                  />
                </td>
                <td>
                  {{ accessory.AccessoryCode || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessoryType || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessorSerialNumber || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessoryMAC || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessoryManufctur || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessoryImportDate || 'not found' }}
                </td>
                <td>
                  {{ accessory.AccessoryRecivedDate || 'not found' }}
                </td>
                <td>
                  {{ accessory.CostomerGroup || 'not found' }}
                </td>
                <td>
                  {{ accessory.StatusLVN || 'not found' }}
                </td>
                <td>
                  <VBtn
                    v-if="accessory.device_id"
                    variant="text"
                    class="text-lowercase"
                    @click="goToDevicePage(accessory.device_id)"
                  >
                    get device
                  </VBtn>
                  <VBtn
                    v-else
                    variant="text"
                    class="text-error text-lowercase"
                  >
                    not found
                  </VBtn>
                </td>

                <td
                  v-if="$can('update', 'accessory') || $can('delete', 'accessory')"
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    v-if="$can('update', 'accessory') "
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="goToEditPage(accessory.AccessoryId)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    v-if="$can('delete', 'accessory') "
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteaccessories(accessory.AccessoryId)"
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
            <tfoot v-else>
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

          <VCardText
            v-if="accessories.length > 0"
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
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
    <DeleteDialog
      title="Are you sure you want to delete the accessory?"
      url="accessory"
      :data="deleteItems"
      :dialog="dialog"
      @close="closeDeleteDialog"
      @confirm="confermDeleteDialog"
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
