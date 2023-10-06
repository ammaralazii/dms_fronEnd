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
import type { cardInfo } from '@/types/interfaces/card-info'
import FilterDate from '@/views/base/FilterDate.vue'
import ImportDialog from '@/views/base/ImportDialog.vue'
import { exportToExcel } from '@/helper/exportToExcel'

const alert = useAlertsStore()
const router = useRouter()

// 👉 Store
const searchCode = ref()
const rowPerPage = ref(10)
const currentPage = ref(1)
const totalPage = ref(1)
const totalCards = ref(0)
const cards = ref<cardInfo[]>([])
const oldList = ref()
const userCount = ref<number>()
const loadCards = ref(false)
const selectedCards = ref([])
const selectAll = ref(false)
const deleteItems = ref([])
const dialog = ref(false)
const loadingUpload = ref(false)
const excelInput = ref()
const importDialog = ref(false)

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

// 👉 Fetching cards
const fetchCards = () => {
  loadCards.value = true
  alert.fetchCards(params.value).then(response => {
    loadCards.value = false
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

onMounted(() => {
  fetchCards()
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
  const firstIndex = cards.value.length ? ((currentPage.value - 1) * rowPerPage.value) + 1 : 0
  const lastIndex = cards.value.length + ((currentPage.value - 1) * rowPerPage.value)

  return `Showing ${firstIndex} to ${lastIndex} of ${totalCards.value} entries`
})

// this function to add all card id to selectedCards

watch(() => selectAll.value, (val: boolean) => {
  if (val)
    selectedCards.value = cards.value.map(card => card.CardId) as any
  else selectedCards.value = []
})// /watch

// this to add hash if the checkbox is not all checked
const isIndeterminate = computed(() => {
  return selectedCards.value.length > 0 && selectedCards.value.length < cards.value.length
})// /isIndeterminate

const selectAllcards = () => {
  if (!selectAll.value)
    selectedCards.value = []

  else
    selectedCards.value = cards.value.map(card => card.CardId) as any
}// /selectAllcards

// this function to delete cards
const deleteCards = (ids?: any) => {
  if (selectedCards.value.length > 0)
    deleteItems.value = selectedCards.value
  else
    deleteItems.value.push(ids as never)
  dialog.value = true
}// /deleteCards

const closeDeleteDialog = () => {
  deleteItems.value = []
  dialog.value = false
}// /closeDeleteDialog

const confermDeleteDialog = (ids?: any) => {
  deleteItems.value = []
  dialog.value = false
  if (selectedCards.value.length > 0) {
    cards.value = cards.value.filter((item: any) => {
      if (!selectedCards.value.includes(item.CardId as never))
        return item
    })
  }
  else {
    ids.forEach((id: any) => {
      cards.value = cards.value.filter(item => item.CardId !== id)
    })
  }
}// /confermDeleteDialog

// this funnction to do filter on device table
const dataFiltering = (data: any) => {
  if (!data.type) {
    delete data.type
    delete params.value.type
  }
  params.value = { ...params.value, ...data }
  fetchCards()
}// /filter

const searchQuery = debounce((val: string) => {
  params.value.code = val as any
  fetchCards()
}, 2000)

watch(() => searchCode.value, (val: string) => {
  searchQuery(val)
})// /watch

const openExcelDialog = () => {
  importDialog.value = true
}// /openExcelDialog

const goToEditPage = (id: string) => {
  console.log('id : ', id)
  router.push({
    name: 'apps-main-store-cards-view-id',
    params: {
      id,
    },
    query: { edit: true as any },
  })
}// /goToEditPage

const godisplayEditPage = (id: string) => {
  router.push({
    name: 'apps-main-store-cards-view-id',
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
          <VCardText v-if="$can('get', 'card')">
            <FilterDate
              type="card"
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
                v-if="$can('get', 'card')"
                style="width: 10rem;"
              >
                <VTextField
                  v-model="searchCode"
                  placeholder="Search"
                  density="compact"
                />
              </div>
            </div>

            <VSpacer />

            <div class=" d-flex align-center flex-wrap gap-4">
              <!-- 👉 Export button -->
              <VBtn
                v-if="selectedCards.length > 0 && $can('delete', 'card')"
                variant="tonal"
                color="secondary"
                prepend-icon="ph-trash"
                @click="deleteCards"
              >
                Delete
              </VBtn>
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="ph-arrow-square-out"
                @click="exportToExcel('myTable', 'card', [0, 17], 20)"
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

              <!-- 👉 Add user button -->
              <VBtn
                v-if="$can('create', 'card')"
                prepend-icon="tabler-plus"
                @click="$router.push('/apps/main-store/cards/add')"
              >
                Add New Card
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
          <VProgressLinear
            v-if="loadCards"
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
                    @change="selectAllcards"
                  />
                </th>
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
                  scope="col"
                >
                  Prepost Paid
                </th>
                <th
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
                <th
                  v-if="$can('update', 'card') || $can('delete', 'card')"
                  scope="col"
                >
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
                class="tableHover"
                @dblclick="godisplayEditPage(card.CardId)"
              >
                <td>
                  <VCheckbox
                    v-model="selectedCards"
                    :value="card.CardId"
                  />
                </td>
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
                  v-if="$can('update', 'card') || $can('delete', 'card')"
                  class="text-center"
                  style="width: 5rem;"
                >
                  <VBtn
                    v-if="$can('update', 'card') "
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="goToEditPage(card.CardId)"
                  >
                    <VIcon
                      size="22"
                      icon="tabler-edit"
                    />
                  </VBtn>

                  <VBtn
                    v-if="$can('delete', 'card') "
                    icon
                    size="x-small"
                    color="default"
                    variant="text"
                    @click="deleteCards(card.CardId)"
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
    <DeleteDialog
      title="Are you sure you want to delete the card?"
      url="card"
      :data="deleteItems"
      :dialog="dialog"
      @close="closeDeleteDialog"
      @confirm="confermDeleteDialog"
    />
    <ImportDialog
      :dialog="importDialog"
      url="card/upload_excel_file"
      filename="card_strctuer"
      @close="() => {
        importDialog = !importDialog
        fetchCards()
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
