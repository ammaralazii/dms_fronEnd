<script setup lang="ts">
import moment from 'moment'
import DispalyFile from '@/views/base/DispalyFile.vue'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteFileDialog from '@/views/apps/devices/file-attachment/DeleteFileDialog.vue'

interface File {
  FileId: string
  FileOriginalName: string
  FileExtension: string
  device_attachment: string
  created_at: Date | string
}// /file interface

const props = defineProps({
  isDrawerFileOpen: {
    type: Boolean,
    required: true,
  },

  files: {
    type: Array as () => File[],
    required: true,
  },
})// /props

const emit = defineEmits(['update:isDrawerFileOpen'])

const deleteItem = ref(false)

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerFileOpen', val)
}

const deleteItemConfirmed = () => {
  deleteItem.value = false
  alert('The necessary requirements are being added to the server now')
}// /deleteItemConfirmed

const addFile = () => {
  alert('The necessary requirements are being added to the server now')
}// /addFile
</script>

<template>
  <VNavigationDrawer
    temporary
    :width="800"
    location="end"
    class="scrollable-content"
    :model-value="props.isDrawerFileOpen"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <VBtn
      density="default"
      icon="ph-x"
      variant="text"
      class="ml-auto"
      @click="handleDrawerModelValueUpdate(false)"
    />
    <VCard>
      <VCardText class="d-flex justify-space-between align-center">
        <VRow>
          <VCol
            cols="12"
            xl="6"
            md="6"
            sm="12"
            xs="12"
          >
            here device name
          </VCol>
          <VCol
            cols="12"
            xl="6"
            md="6"
            sm="12"
            xs="12"
            class="px-0 d-flex justify-end"
          >
            <VBtn
              variant="tonal"
              color="secondary"
              prepend-icon="ph-arrow-square-out"
              class="mx-3"
              @click="exportToExcel('myFilesTable')"
            >
              Export
            </VBtn>
            <VBtn
              variant="tonal"
              color="primary"
              prepend-icon="ph-plus"
              @click="addFile"
            >
              Add File
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
    <VTable
      id="myFilesTable"
      class="text-no-wrap"
    >
      <!-- 👉 table head -->
      <thead>
        <tr>
          <th
            scope="col"
          >
            Name
          </th>
          <th
            scope="col"
          >
            Extension
          </th>
          <th
            scope="col"
          >
            Created At
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
      <tbody v-if="files">
        <tr
          v-for="(file, index) in files"
          :key="index"
          style="height: 3.75rem;"
        >
          <td>
            {{ file.FileOriginalName.split('.')[0] }}
          </td>
          <td>
            {{ file.FileExtension }}
          </td>
          <td>
            {{ moment(file.created_at).format('YYYY-MM-DD LT') }}
          </td>
          <td
            style="width: 10rem;gap: 10px;"
            class="text-center"
          >
            <DispalyFile
              :id="`file/${file.FileId}`"
              page-title="display information file"
            />
            <VBtn
              icon
              size="x-small"
              color="error"
              variant="text"
              @click="deleteItem = true"
            >
              <VIcon
                size="22"
                icon="tabler-trash"
              />
              <DeleteFileDialog
                :dialog="deleteItem"
                title="Are you sure to delete this item ?"
                @close="() => deleteItem = false"
                @confirm="deleteItemConfirmed"
              />
            </VBtn>
          </td>
        </tr>
      </tbody>

      <!-- 👉 table footer -->
      <tfoot v-if="!files">
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
  </VNavigationDrawer>
</template>

