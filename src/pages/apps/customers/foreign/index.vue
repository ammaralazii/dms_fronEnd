<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import moment from 'moment'
import FilterDate from '@/views/base/FilterDate.vue'
import { useAlertsStore } from '@/stores'
import type { foreignInfo } from '@/types/interfaces/foreign-info'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteDialog from '@/views/base/DeleteDialog.vue'
import ImportDialog from '@/views/base/ImportDialog.vue'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const rowPerPage = ref(15)
const currentPage = ref(1)
const totalPage = ref(1)
const totalforeigns = ref(0)
const foreigns = ref<foreignInfo[]>([])
const oldList = ref()
const foreignCount = ref<number>()
const dialog = ref(false)
const deleteItems = ref<any>([])
const excelInput = ref()
const loadingUpload = ref(false)
const selectedforeigns = ref([])
const selectAll = ref(false)
const loadingGetForeigns = ref<boolean>(false)
const searchCode = ref()
const importDialog = ref(false)

const params = ref({
  per_page: rowPerPage.value,
  page: currentPage.value,
  code: null,
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchforeigns()
})

// 👉 Fetching foreigns
const fetchforeigns = () => {
  loadingGetForeigns.value = true
  alert.fetchforeigns(params.value).then(response => {
    if (response.data?.success) {
      foreigns.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalforeigns.value = response.data.data.total
      foreignCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  }).finally(() => loadingGetForeigns.value = false)
}// /fetchUsers

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = foreigns.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = foreigns.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalforeigns.value} entries`
})

watch(() => currentPage.value, val => {
  params.value.per_page = rowPerPage.value
  params.value.page = val
  fetchforeigns()
})

const deleteDialog = (id: any) => {
  if (selectedforeigns.value.length > 0)
    deleteItems.value = selectedforeigns.value
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
  if (selectedforeigns.value.length > 0) {
    // eslint-disable-next-line array-callback-return
    foreigns.value = foreigns.value.filter((item: any) => {
      if (!selectedforeigns.value.includes(item.ForeignId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      foreigns.value = foreigns.value.filter(item => item.ForeignId !== id)
    })
  }
}// /confermDeleteDialog

const goToEditPage = (id: any) => {
  router.push({
    name: 'apps-customers-foreign-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const openExcelDialog = () => {
  importDialog.value = true
}// /openExcelDialog

// this function to add all foreign id to selectedforeigns

watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedforeigns.value = foreigns.value.map(foreign => foreign.ForeignId) as any
  else selectedforeigns.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedforeigns.value.length > 0 && selectedforeigns.value.length < foreigns.value.length
})// /isIndeterminate

const selectAllforeigns = () => {
  if (!selectAll.value)
    selectedforeigns.value = []

  else
    selectedforeigns.value = foreigns.value.map(foreign => foreign.ForeignId) as any
}// /selectAllforeigns

// this funnction to do filter on foreign table
const dataFiltering = (data: any) => {
  if (!data.type)
    delete data.type

  params.value = { ...params.value, ...data }
  fetchforeigns()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  fetchforeigns()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch

const godisplayEditPage = (id: string) => {
  router.push({
    name: 'apps-customers-foreign-view-id',
    params: {
      id,
    },
  })
}// /goToEditPage
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <!-- 👉 Filters -->
          <!--
            <VCardText>
            <FilterDate
            type="foreign"
            @dataFiltering="dataFiltering"
            />
            </VCardText>
          -->

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
                v-if="selectedforeigns.length > 0"
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
                @click="exportToExcel(foreigns.filter((foreign) => {
                  if (selectedforeigns.includes(foreign.ForeignId))
                    return foreign
                }), 'myTable', 'foreign', selectedforeigns.length > 0 ? ['ForeignId', 'other_information', 'sars', 'work_permit'] : [0, 7], 20)"
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
              <!-- 👉 Add new foreign -->
              <VBtn
                to="/apps/customers/foreign/add"
                link
              >
                Add New foreign
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VProgressLinear
            v-if="loadingGetForeigns"
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
                    @change="selectAllforeigns"
                  />
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  First Name
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Second Name
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Third Name
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Marital Status
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Gender
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Phone number
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Phone number 2
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Email
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
            <tbody v-if="foreigns.length > 0">
              <tr
                v-for="(foreign, index) in foreigns"
                :key="index"
                style="height: 3.75rem;"
                class="tableHover"
                @dblclick="godisplayEditPage(foreign.ForeignId)"
              >
                <td>
                  <VCheckbox
                    v-model="selectedforeigns"
                    :value="foreign.ForeignId"
                  />
                </td>
                <td>
                  {{ foreign.ForeignFirstName || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignSecondName || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignThirdName || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignMaritalStatus || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignGender }}
                </td>
                <td>
                  {{ foreign.ForeignPhoneNumber || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignPhoneNumber2 || 'not found' }}
                </td>
                <td>
                  {{ foreign.ForeignEmail || 'not found' }}
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
                    @click="goToEditPage(foreign.ForeignId)"
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
                    :disabled="selectedforeigns.length > 0 ? true : false"
                    @click="deleteDialog(foreign.ForeignId)"
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
            <tfoot v-if="foreigns.length === 0">
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

    <DeleteDialog
      :dialog="dialog"
      :data="deleteItems"
      title="Delete foreign"
      url="foreign"
      @close="closeDeleteDialog"
      @confirm="confermDeleteDialog"
    />

    <ImportDialog
      :dialog="importDialog"
      url="upload_excel_foreign"
      filename="foreign_strctuer"
      @close="() => {
        importDialog = false
        fetchforeigns()
      }"
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

