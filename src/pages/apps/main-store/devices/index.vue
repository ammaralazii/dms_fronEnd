<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { ref } from 'vue'
import FileDialog from '@/views/apps/devices/FileDialog.vue'
import { useAlertsStore } from '@/stores'
import type { deviceInfo } from '@/types/interfaces/device-info'
import { exportToExcel } from '@/helper/exportToExcel'

const alert = useAlertsStore()

// 👉 Store
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalDevices = ref(0)
const devices = ref<deviceInfo[]>([])
const oldList = ref()
const userCount = ref<number>()
const files = ref([])
const device_attachment = ref()

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchDevices()
})

// 👉 Fetching users
const fetchDevices = () => {
  alert.fetchDevices({
    perPage: rowPerPage.value,
    currentPage: currentPage.value,
  }).then(response => {
    if (response.data?.success) {
      devices.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalDevices.value = response.data.data.total
      userCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  })
}// /fetchUsers

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

const isFileDrawerVisible = ref(false)
const isAddFileDrawerVisable = ref(false)

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
                @click="exportToExcel('myTable')"
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

              <!-- 👉 Add new device -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isAddFileDrawerVisable = true"
              >
                Add New Device
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VProgressLinear
            v-if="!devices.length"
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
                    @click="isFileDrawerVisible = true"
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
