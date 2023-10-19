<!-- eslint-disable array-callback-return -->
<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'
import moment from 'moment'
import FilterDate from '@/views/base/FilterDate.vue'
import { useAlertsStore } from '@/stores'
import type { personalInfo } from '@/types/interfaces/personal-info'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteDialog from '@/views/base/DeleteDialog.vue'
import ImportDialog from '@/views/base/ImportDialog.vue'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const rowPerPage = ref(15)
const currentPage = ref(1)
const totalPage = ref(1)
const totalpersonals = ref(0)
const personals = ref<personalInfo[]>([])
const oldList = ref()
const personalCount = ref<number>()
const dialog = ref(false)
const deleteItems = ref<any>([])
const excelInput = ref()
const loadingUpload = ref(false)
const selectedpersonals = ref([])
const selectAll = ref(false)
const loadingGetPersonals = ref<boolean>(false)
const searchCode = ref()
const importDialog = ref(false)

const params = ref({
  per_page: rowPerPage.value,
  page: currentPage.value,
  code: null,
})

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  fetchpersonals()
})

// 👉 Fetching personals
const fetchpersonals = () => {
  loadingGetPersonals.value = true
  alert.fetchpersonals(params.value).then(response => {
    if (response.data?.success) {
      personals.value = response.data.data.data
      oldList.value = response.data.data.data
      totalPage.value = response.data.data.last_page
      totalpersonals.value = response.data.data.total
      personalCount.value = response.data.data.data.length
    }// /if
  }).catch(error => {
    console.error(error)
  }).finally(() => loadingGetPersonals.value = false)
}// /fetchUsers

// 👉 watching current page
watchEffect(() => {
  if (currentPage.value > totalPage.value)
    currentPage.value = totalPage.value
})

// 👉 Computing pagination data
const paginationData = computed(() => {
  const firstIndex = personals.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = personals.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalpersonals.value} entries`
})

watch(() => currentPage.value, val => {
  params.value.per_page = rowPerPage.value
  params.value.page = val
  fetchpersonals()
})

const deleteDialog = (id: any) => {
  if (selectedpersonals.value.length > 0)
    deleteItems.value = selectedpersonals.value
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
  if (selectedpersonals.value.length > 0) {
    personals.value = personals.value.filter((item: any) => {
      if (!selectedpersonals.value.includes(item.PersonalId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      personals.value = personals.value.filter(item => item.PersonalId !== id)
    })
  }
}// /confermDeleteDialog

const goToEditPage = (id: any) => {
  router.push({
    name: 'apps-customers-personal-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const openExcelDialog = () => {
  importDialog.value = true
}// /openExcelDialog

// this function to add all personal id to selectedpersonals

watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedpersonals.value = personals.value.map(personal => personal.personalId) as any
  else selectedpersonals.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedpersonals.value.length > 0 && selectedpersonals.value.length < personals.value.length
})// /isIndeterminate

const selectAllpersonals = () => {
  if (!selectAll.value)
    selectedpersonals.value = []

  else
    selectedpersonals.value = personals.value.map(personal => personal.PersonalId) as any
}// /selectAllpersonals

// this funnction to do filter on personal table
const dataFiltering = (data: any) => {
  if (!data.type) {
    delete data.type
    delete params.value.type
  }
  params.value = { ...params.value, ...data }
  fetchpersonals()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  fetchpersonals()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch

const godisplayEditPage = (id: string) => {
  router.push({
    name: 'apps-customers-personal-view-id',
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
            type="personal"
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
                v-if="selectedpersonals.length > 0"
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
                @click="exportToExcel(personals.filter((personal) => {
                  if (selectedpersonals.includes(personal.PersonalId))
                    return personal
                }), 'myTable', 'personal', [0, 12], 20)"
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
              <!-- 👉 Add new personal -->
              <VBtn
                to="/apps/customers/personal/add"
                link
              >
                Add New personal
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <VProgressLinear
            v-if="loadingGetPersonals"
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
                    @change="selectAllpersonals"
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
                  ID number
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Birth Date
                </th>
                <th
                  class="text-center"
                  scope="col"
                >
                  Ethnic
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Marital Status
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Gender
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Residency Card ID
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  Phone Number 2
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
            <tbody v-if="personals.length > 0">
              <tr
                v-for="(personal, index) in personals"
                :key="index"
                style="height: 3.75rem;"
                class="tableHover"
                @dblclick="godisplayEditPage(personal.PersonalId)"
              >
                <td>
                  <VCheckbox
                    v-model="selectedpersonals"
                    :value="personal.PersonalId"
                  />
                </td>
                <td>
                  {{ personal.personalFirstName || 'not found' }}
                </td>
                <td>
                  {{ personal.personalSecondName || 'not found' }}
                </td>
                <td>
                  {{ personal.personalTirdName || 'not found' }}
                </td>
                <td>
                  {{ personal.personalIdNumber || 'not found' }}
                </td>
                <td>
                  {{ moment(personal.personalBirthDate).format('YYYY/MM/DD') || 'not found' }}
                </td>
                <td>
                  {{ personal.personalEthnic || 'not found' }}
                </td>
                <td>
                  {{ personal.personalMaritalStatus || 'not found' }}
                </td>
                <td>
                  {{ personal.personalGender || 'not found' }}
                </td>
                <td>
                  {{ personal.personalResidencyCardID || 'not found' }}
                </td>
                <td>
                  {{ personal.personalPhoneNumber || 'not found' }}
                </td>
                <td>
                  {{ personal.personalPhoneNumber2 || 'not found' }}
                </td>
                <td>
                  {{ personal.PersonalEmail || 'not found' }}
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
                    @click="goToEditPage(personal.PersonalId)"
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
                    :disabled="selectedpersonals.length > 0 ? true : false"
                    @click="deleteDialog(personal.PersonalId)"
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
            <tfoot v-if="personals.length === 0">
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
      title="Delete personal"
      url="personal"
      @close="closeDeleteDialog"
      @confirm="confermDeleteDialog"
    />

    <ImportDialog
      :dialog="importDialog"
      url="upload_excel_personal"
      filename="personal_strctuer"
      @close="() => {
        importDialog = false
        fetchpersonals()
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
