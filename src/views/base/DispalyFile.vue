<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import axiosIns from '@/plugins/axios'

// Assuming you have axiosIns installed and imported

const props = defineProps({
  pageTitle: {
    required: true,
    type: String,
  },
  id: {
    required: true,
    type: String,
  },
})

const dialog = ref(false)

watch(() => dialog.value, val => {
  if (val) {
    // Fetch and display a file (image, PDF, XLS, XLSX, etc.)
    axiosIns.get(props.id, { responseType: 'arraybuffer' })
      .then((response: any) => {
        if (response.status === 200) {
          const contentType = response.headers['content-type']
          const fileBlob = new Blob([response.data], { type: contentType })
          const content = document.getElementsByClassName('content')[0] as HTMLDivElement

          content.style.width = '100%'
          content.style.height = '100%'

          if (contentType.startsWith('image/')) {
            // Display the image in an <img> element for image files
            const imageUrl = URL.createObjectURL(fileBlob)
            const imgElement = document.createElement('img')

            imgElement.src = imageUrl
            imgElement.style.width = '100%'
            imgElement.style.height = '100%'
            content.innerHTML = ''
            content.appendChild(imgElement) // Add to the DOM
          }
          else if (contentType === 'application/pdf') {
            // Display the PDF in an <iframe> element for PDF files
            const pdfUrl = URL.createObjectURL(fileBlob)
            const iframe = document.createElement('iframe')

            iframe.src = pdfUrl
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            content.innerHTML = ''
            content.appendChild(iframe) // Add to the DOM
          }
          else if (contentType === 'application/vnd.ms-excel' || contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            // Handle XLS and XLSX files here, e.g., provide download link
            const fileUrl = URL.createObjectURL(fileBlob)
            const downloadLink = document.createElement('a')

            downloadLink.href = fileUrl
            downloadLink.download = 'file.xlsx' // Set the desired file name
            downloadLink.textContent = 'Download XLSX' // Change the link text as needed
            downloadLink.style.width = '100%'
            downloadLink.style.height = '100%'
            content.innerHTML = ''
            content.appendChild(downloadLink) // Add to the DOM
          }
          else {
            console.error('Unsupported file type:', contentType)
          }
        }
        else {
          console.error('Failed to fetch file:', response.statusText)
        }
      })
      .catch((error: any) => {
        console.error('Error fetching file:', error)
      })
  }
  else {
    dialog.value = val
  }// /if
})
</script>

<template>
  <VBtn
    icon
    size="x-small"
    color="primary"
    variant="text"
    @click="dialog = true"
  >
    <VIcon
      size="22"
      icon="ph-eye"
    />
    <VDialog
      v-model="dialog"
      width="800"
    >
      <VCard height="800">
        <VCardTitle class="d-flex justify-space-between align-center">
          {{ pageTitle }}

          <VBtn
            variant="text"
            icon="ph-x"
            color="primary"
            @click="dialog = false"
          />
        </VCardTitle>
        <VCardText>
          <div class="content">
            not data avalibale
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </VBtn>
</template>

<style lang="scss" scoped>
.button {
  inline-size: 100px;
}
</style>

