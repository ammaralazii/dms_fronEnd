<script setup lang="ts">
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  hasFile: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
  filename: {
    required: true,
    type: String,
  },
})

const emit = defineEmits(['close'])

const notes = [
  {
    icon: 'ph-bird',
    text: 'You must first download this file',
  },
  {
    icon: 'ph-bird',
    text: 'Save the file in a place where it can be found at any time',
  },
  {
    icon: 'ph-bird',
    text: 'When uploading any new content, you must add the content to the file and upload it',
  },
]

const download = () => {
  let excelFileUrl = ''

  if (props.filename === 'accessory_strctuer')
    excelFileUrl = '/src/static/accessory_strctuer.xlsx'
  else if (props.filename === 'device_strctuer')
    excelFileUrl = '/src/static/device_strctuer.xlsx'
  else excelFileUrl = '/src/static/card_strctuer.xlsx'

  // Create an anchor element to trigger the download
  const anchor = document.createElement('a')

  anchor.href = excelFileUrl
  anchor.download = `${props.filename}.xlsx` // Specify the desired filename for the download

  // Programmatically trigger the click event on the anchor element
  anchor.click()
  localStorage.setItem(props.hasFile, true as any)
  emit('close')
}// /download
</script>

<template>
  <VRow justify="center">
    <VDialog
      v-model="props.dialog"
      persistent
      width="auto"
    >
      <template #activator="{ props }" />
      <VCard>
        <VCardTitle class="text-h5">
          Download the basic version of the file.
        </VCardTitle>
        <VCardText>
          {{ props.content }}

          <VList disabled>
            <VListSubheader>REPORTS</VListSubheader>

            <VListItem
              v-for="(item, i) in notes"
              :key="i"
            >
              <template #prepend>
                <VIcon :icon="item.icon" />
              </template>

              <VListItemTitle v-text="item.text" />
            </VListItem>
          </VList>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="error"
            variant="text"
            @click="emit('close')"
          >
            Close
          </VBtn>
          <VBtn
            color="primary"
            @click="download"
          >
            Download
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>

<style scoped>

</style>
