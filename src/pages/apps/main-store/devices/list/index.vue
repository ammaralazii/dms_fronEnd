<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import FilterDate from '@/views/base/FilterDate.vue'
import FileDialog from '@/views/apps/devices/FileDialog.vue'
import { useAlertsStore } from '@/stores'
import type { deviceInfo } from '@/types/interfaces/device-info'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteDialog from '@/views/base/DeleteDialog.vue'
import { baseService } from '@/api/BaseService'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalDevices = ref(0)
const devices = ref<deviceInfo[]>([])
const oldList = ref()
const userCount = ref<number>()
const files = ref([])
const device_attachment = ref()
const dialog = ref(false)
const deleteItems = ref<any>([])
const excelInput = ref()
const loadingUpload = ref(false)
const selectedDevices = ref([])
const selectAll = ref(false)
const loadingGetDiveces = ref<boolean>(false)
const searchCode = ref()

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

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchDevices()
})

// 👉 Fetching devices
const fetchDevices = () => {
  loadingGetDiveces.value = true
  alert.fetchDevices(params.value).then(response => {
    if (response.data?.success) {
      devices.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalDevices.value = response.data.data.total
      userCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  }).finally(() => loadingGetDiveces.value = false)
}// /fetchUsers

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

const isFileDrawerVisible = ref(false)

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = devices.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = devices.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalDevices.value} entries`
})

// 👉 Display file drawer
const openFileDrawer = (deviceFiles: any, attachmentDevice: any, check: boolean) => {
  isFileDrawerVisible.value = check
  files.value = deviceFiles
  device_attachment.value = attachmentDevice
}// /openFileDrawer

const deleteDialog = (id: any) => {
  if (selectedDevices.value.length > 0)
    deleteItems.value = selectedDevices.value
  else
    deleteItems.value.push(id)
  dialog.value = true
}// /deleteDialog

const closeDeleteDialog = () => {
  deleteItems.value = []
  dialog.value = false
}

const confermDeleteDialog = (ids?: any) => {
  deleteItems.value = []
  dialog.value = false
  if (selectedDevices.value.length > 0) {
    devices.value = devices.value.filter((item: any) => {
      if (!selectedDevices.value.includes(item.DeviceId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      devices.value = devices.value.filter(item => item.DeviceId !== id)
    })
  }
}// /confermDeleteDialog

const goToEditPage = (id: any) => {
  router.push({
    name: 'apps-main-store-devices-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const getAccessories = (id: string) => {
  router.push({
    name: 'apps-main-store-accessories-list',
    query: {
      deviceId: id,
    },
  })
}// /getAccessories

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
  result = await baseService.create('upload_excel_device', formData) as any

  loadingUpload.value = false

  if (result.success) {
    payload.color = 'success'
    payload.text = 'file uploaded successfly .'
    alert.$state.tosts.push(payload)
  }// /if
}// /uploadExcelFile

// this function to add all device id to selectedDevices

watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedDevices.value = devices.value.map(device => device.DeviceId) as any
  else selectedDevices.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedDevices.value.length > 0 && selectedDevices.value.length < devices.value.length
})// /isIndeterminate

const selectAllDevices = () => {
  if (!selectAll.value)
    selectedDevices.value = []

  else
    selectedDevices.value = devices.value.map(device => device.DeviceId) as any
}// /selectAllDevices

// this funnction to do filter on device table
const dataFiltering = (data: any) => {
  if (!data.type) {
    delete data.type
    delete params.value.type
  }
  params.value = { ...params.value, ...data }
  fetchDevices()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  fetchDevices()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <VCardText>
            <FilterDate
              type="device"
              @dataFiltering="dataFiltering"
            />
          </VCardText>

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div
              class="me-3"
              style="width: 80px;"
            >
              <!-- 👉 Search  -->
              <div style="width: 10.3rem;">
                <VTextField
                  v-model="searchCode"
                  clearable
                  placeholder="Search"
                  density="compact"
                />
              </div>
            </div>

            <VSpacer />

            <div class=" d-flex align-center flex-wrap gap-4">
              <!-- 👉 Export button -->
              <VBtn
                v-if="selectedDevices.length > 0"
                variant="tonal"
                color="secondary"
                prepend-icon="ph-trash"
                @click="deleteDialog"
              >
                Delete
              </VBtn>
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="ph-arrow-square-out"
                @click="exportToExcel('myTable')"
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
              <!-- 👉 Add new device -->
              <VBtn
                to="/apps/main-store/devices/add"
                link
              >
                Add New Device
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VProgressLinear
            v-if="loadingGetDiveces"
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
                    @change="selectAllDevices"
                  />
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Code
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Main box number
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Secondary fund number
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  IMEI
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Serial number
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  MAC
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  FW version
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Import date
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Recived date
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Agreement CMC
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Manufctur
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Costomer group
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Status LVN
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Files
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Accessories
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody v-if="devices.length > 0">
              <tr
                v-for="(device, index) in devices"
                :key="index"
                style="height: 3.75rem;"
              >
                <td>
                  <VCheckbox
                    v-model="selectedDevices"
                    :value="device.DeviceId"
                  />
                </td>
                <td>
                  {{ device.DeviceCode }}
                </td>
                <td>
                  {{ device.BoxNoMain || 'not found' }}
                </td>
                <td>
                  {{ device.BoxNoSub || 'not found' }}
                </td>
                <td>
                  {{ device.IMEI || 'not found' }}
                </td>
                <td>
                  {{ device.DeviceSerialNumber || 'not found' }}
                </td>
                <td>
                  {{ device.DeviceMAC || 'not found' }}
                </td>
                <td>
                  {{ device.FWVersion || 'not found' }}
                </td>
                <td>
                  {{ device.DeciveImportDate || 'not found' }}
                </td>
                <td>
                  {{ device.DeviceRecivedDate || 'not found' }}
                </td>
                <td>
                  {{ device.AgreementCMC || 'not found' }}
                </td>
                <td>
                  {{ device.DeviceType || 'not found' }}
                </td>
                <td>
                  {{ device.DeviceManufctur || 'not found' }}
                </td>
                <td>
                  {{ device.CostomerGroup || 'not found' }}
                </td>
                <td>
                  {{ device.StatusLVN || 'not found' }}
                </td>
                <td>
                  <VBtn
                    v-if="device?.files?.length"
                    class="text-lowercase blak-text"
                    variant="text"
                    @click="openFileDrawer(device.files, device.DeviceAttachment, true)"
                  >
                    get files
                  </VBtn>

                  <VBtn
                    v-else
                    class="text-lowercase text-error"
                    variant="text"
                  >
                    not found
                  </VBtn>
                </td>
                <td>
                  <VBtn
                    v-if="device?.accessories?.length"
                    class="text-lowercase blak-text"
                    variant="text"
                    @click="getAccessories(device.DeviceId)"
                  >
                    get accessories
                  </VBtn>
                  <VBtn
                    v-else
                    class="text-lowercase text-error"
                    variant="text"
                  >
                    not found
                  </VBtn>
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
                    @click="goToEditPage(device.DeviceId)"
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
                    :disabled="selectedDevices.length > 0 ? true : false"
                    @click="deleteDialog(device.DeviceId)"
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
            <tfoot v-if="devices.length === 0">
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
    <FileDialog
      v-model:isDrawerFileOpen="isFileDrawerVisible"
      :files="files"
      :device_attachment="device_attachment"
    />

    <DeleteDialog
      :dialog="dialog"
      :data="deleteItems"
      title="Delete Device"
      url="device"
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
