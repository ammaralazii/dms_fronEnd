<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import moment from 'moment'
import FilterDate from '@/views/base/FilterDate.vue'
import { useAlertsStore } from '@/stores'
import type { companyInfo } from '@/types/interfaces/company-info'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteDialog from '@/views/base/DeleteDialog.vue'
import ImportDialog from '@/views/base/ImportDialog.vue'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const rowPerPage = ref(15)
const currentPage = ref(1)
const totalPage = ref(1)
const totalcompanys = ref(0)
const companys = ref<companyInfo[]>([])
const oldList = ref()
const companyCount = ref<number>()
const dialog = ref(false)
const deleteItems = ref<any>([])
const excelInput = ref()
const loadingUpload = ref(false)
const selectedcompanys = ref([])
const selectAll = ref(false)
const loadingGetCompanies = ref<boolean>(false)
const searchCode = ref()
const importDialog = ref(false)

const params = ref({
  per_page: rowPerPage.value,
  page: currentPage.value,
  code: null,
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchcompanys()
})

// 👉 Fetching companys
const fetchcompanys = () => {
  loadingGetCompanies.value = true
  alert.fetchcompanys(params.value).then(response => {
    if (response.data?.success) {
      companys.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalcompanys.value = response.data.data.total
      companyCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  }).finally(() => loadingGetCompanies.value = false)
}// /fetchUsers

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = companys.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = companys.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalcompanys.value} entries`
})

watch(() => currentPage.value, val => {
  params.value.per_page = rowPerPage.value
  params.value.page = val
  fetchcompanys()
})

const deleteDialog = (id: any) => {
  if (selectedcompanys.value.length > 0)
    deleteItems.value = selectedcompanys.value
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
  if (selectedcompanys.value.length > 0) {
    companys.value = companys.value.filter((item: any) => {
      if (!selectedcompanys.value.includes(item.CompanyId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      companys.value = companys.value.filter(item => item.CompanyId !== id)
    })
  }
}// /confermDeleteDialog

const goToEditPage = (id: any) => {
  router.push({
    name: 'apps-customers-company-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const openExcelDialog = () => {
  importDialog.value = true
}// /openExcelDialog

// this function to add all company id to selectedcompanys
watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedcompanys.value = companys.value.map(company => company.CompanyId) as any
  else selectedcompanys.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedcompanys.value.length > 0 && selectedcompanys.value.length < companys.value.length
})// /isIndeterminate

const selectAllcompanys = () => {
  if (!selectAll.value)
    selectedcompanys.value = []

  else
    selectedcompanys.value = companys.value.map(company => company.CompanyId) as any
}// /selectAllcompanys

// this funnction to do filter on company table
const dataFiltering = (data: any) => {
  if (!data.type) {
    delete data.type
    delete params.value.type
  }
  params.value = { ...params.value, ...data }
  fetchcompanys()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  fetchcompanys()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch

const godisplayEditPage = (id: string) => {
  router.push({
    name: 'apps-customers-company-view-id',
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
            type="company"
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
                v-if="selectedcompanys.length > 0"
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
                @click="exportToExcel(companys.filter((company) => {
                  if (selectedcompanys.includes(company.CompanyId))
                    return company
                }), 'myTable', 'company', selectedcompanys ? [0, 6] : [0, 7], 20)"
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
              <!-- 👉 Add new company -->
              <VBtn
                to="/apps/customers/company/add"
                link
              >
                Add New company
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VProgressLinear
            v-if="loadingGetCompanies"
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
                    @change="selectAllcompanys"
                  />
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Birth Date
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  SA I.D Number
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Relationship
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
                  Medically Dependen
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody v-if="companys.length > 0">
              <tr
                v-for="(company, index) in companys"
                :key="index"
                style="height: 3.75rem;"
                class="tableHover"
                @dblclick="godisplayEditPage(company.CompanyId)"
              >
                <td>
                  <VCheckbox
                    v-model="selectedcompanys"
                    :value="company.CompanyId"
                  />
                </td>
                <td class="text-center">
                  {{ company.CompanyName || 'not found' }}
                </td>
                <td class="text-center">
                  {{ moment(company.CompanyBirthDate).format('YYYY/MM/DD') || 'not found' }}
                </td>
                <td class="text-center">
                  {{ company.CompanySAIDNumber || 'not found' }}
                </td>
                <td class="text-center">
                  {{ company.CompanyRelationship || 'not found' }}
                </td>
                <td class="text-center">
                  {{ company.CompanyGender || 'not found' }}
                </td>
                <td class="text-center">
                  {{ company.CompanyMedicallyDependent === true ? 'Yes' : 'No' || 'not found' }}
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
                    @click="goToEditPage(company.CompanyId)"
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
                    :disabled="selectedcompanys.length > 0 ? true : false"
                    @click="deleteDialog(company.CompanyId)"
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
            <tfoot v-if="companys.length === 0">
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
      title="Delete company"
      url="company"
      @close="closeDeleteDialog"
      @confirm="confermDeleteDialog"
    />

    <ImportDialog
      :dialog="importDialog"
      url="upload_excel_company"
      filename="company_strctuer"
      @close="() => {
        importDialog = false
        fetchcompanys()
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
