<script setup lang="ts">
import moment from 'moment'
import DispalyFile from '@/views/base/DispalyFile.vue'
import { exportToExcel } from '@/helper/exportToExcel'
import DeleteFileDialog from '@/views/apps/devices/file-attachment/DeleteFileDialog.vue'
import { useAlertsStore } from '@/stores'
import { baseService } from '@/api/BaseService'
import axiosIns from '@/plugins/axios'
import hundlerErorr from '@/helper/hundlerErorr'
import sortByDate from '@/helper/sortByDate'

interface File {
  FileId: string
  FileOriginalName: string
  FileExtension: string
  device_attachment: string
  created_at: Date | string
} // /file interface

const props = defineProps({
  isDrawerFileOpen: {
    type: Boolean,
    required: true,
  },

  files: {
    type: Array as () => File[],
    required: true,
  },
  // eslint-disable-next-line vue/prop-name-casing
  device_attachment: {
    required: true,
    type: String,
  },
  edit: {
    type: Boolean,
  },

})

const emit = defineEmits(['update:isDrawerFileOpen', 'close'])// /props

const fileInput = ref<HTMLInputElement | null>(null)

const fileList = ref<File[]>([])
const itemId = ref()

watch(() => props.files, async (val: any) => {
  fileList.value = sortByDate(val, 'created_at') as any
})

const alert = useAlertsStore()

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

const deleteItem = ref(false)

const checkFileAddClicked = () => {
  console.log('fileInput.value : ', fileInput.value)
  if (fileInput.value)
    fileInput.value.click()
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerFileOpen', val)
}

// this function to delete item from server
const removeItem = (fileId: string) => {
  deleteItem.value = true
  itemId.value = fileId
}

const deleteItemConfirmed = async () => {
  deleteItem.value = false
  fileList.value = fileList.value.filter(item => item.FileId !== itemId.value)
  payload.color = 'success'
  payload.text = 'File deleted successfully.'
  alert.$state.tosts.push(payload)
}

const addFile = async (event: any, device_attachment: string) => {
  const file = event.target.files[0]
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls']
  const fileName = file.name
  const fileExtension = fileName.split('.').pop().toLowerCase()

  // check the file is valid or no
  if (allowedExtensions.includes(`.${fileExtension}`) && device_attachment) {
    try {
      const fileData = new FormData()

      fileData.append('file', file)
      fileData.append('device_attachment', device_attachment)

      let result = null
      result = await axiosIns.post('file', fileData) as any

      if (result.status === 200) {
        const uploadedFile = result.data.data

        fileList.value.unshift(uploadedFile)
        payload.color = 'success'
        payload.text = 'file added successfly .'
        alert.$state.tosts.push(payload)
      }// /if
    }
    catch (e) {
      hundlerErorr(e)
    }// /try catch
  }
  else {
    payload.color = 'warning'
    payload.text = 'invalid file type'
    alert.$state.tosts.push(payload)
  }// if
}// /addFile

const updateFile = async (event: any, fileId: string, index: number) => {
  const file = event.target.files[0]
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls']
  const fileName = file.name
  const fileExtension = fileName.split('.').pop().toLowerCase()

  // check the file is valid or no
  if (allowedExtensions.includes(`.${fileExtension}`) && fileId) {
    try {
      const fileData = new FormData()

      fileData.append('file', file)
      let result = null
      result = await axiosIns.post(`file/${fileId}`, fileData) as any

      if (result.status === 200) {
        fileList.value[index].FileOriginalName = fileName
        fileList.value[index].FileExtension = fileExtension
        payload.color = 'success'
        payload.text = 'file uploaded successfly .'
        alert.$state.tosts.push(payload)
      }// /if
    }
    catch (e) {
      hundlerErorr(e)
    }// /try catch
  }
  else {
    payload.color = 'warning'
    payload.text = 'invalid file type'
    alert.$state.tosts.push(payload)
  }// if
}// /updateFile
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
              @click="exportToExcel([], 'myFilesTable', 'file', [3], 20)"
            >
              Export
            </VBtn>
            <VBtn
              variant="tonal"
              color="primary"
              prepend-icon="ph-plus"
              @click="checkFileAddClicked"
            >
              Add File
            </VBtn>
            <input
              ref="fileInput"
              type="file"
              hidden
              @change="addFile($event, device_attachment)"
            >
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
          v-for="(file, index) in fileList"
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
            style="width: 10rem;"
            class="text-center"
          >
            <DispalyFile
              :id="`file/${file.FileId}`"
              page-title="display information file"
            />
            <input
              :id="`${index}file`"
              :name="`${index}file`"
              type="file"
              hidden
              accept=".pdf, .jpg, .jpeg, .png, .xlsx, .xls"
              @change="updateFile($event, file.FileId, index)"
            >
            <label :for="`${index}file`"><VIcon
              style="cursor: pointer;"
              size="22"
              icon="ph-pencil-simple-line"
              color="success"
              variant="text"
            /></label>
            <VBtn
              icon
              size="x-small"
              color="error"
              variant="text"
              @click="removeItem(file.FileId)"
            >
              <VIcon
                size="22"
                icon="tabler-trash"
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
    <DeleteFileDialog
      :dialog="deleteItem"
      :file-id="itemId"
      title="Are you sure to delete this item ?"
      @close="() => deleteItem = false"
      @confirm="deleteItemConfirmed"
    />
  </VNavigationDrawer>
</template>

