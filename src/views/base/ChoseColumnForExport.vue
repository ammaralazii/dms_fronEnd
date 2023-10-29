<script setup lang="ts">
import splitPacalCase from '@/helper/splitPacalCase'
import { exportToExcel } from '@/helper/exportToExcel'

const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  columns: {
    required: true,
    type: Array,
  },
  data: {
    required: true,
    type: Array,
  },
  fileName: {
    required: true,
    type: String,
  },
  relationalColumns: {
    required: true,
    type: Array as () => string[],
  },
  expectColumns: {
    type: Array as () => string[],
  },
})

const emit = defineEmits(['close'])

const selectAll = ref(false)

const selected = ref<string[]>([])

watch(() => selectAll.value, val => {
  if (val)
    selected.value = props.columns as any[]
  else
    selected.value = []
})

const exportData = () => {
  exportToExcel(props.data, 'myTable', props.fileName, props.expectColumns && props.expectColumns.length > 0 ? props.expectColumns : [], 20, selected.value, props.relationalColumns)
  emit('close')
}// /exportData
</script>

<template>
  <VRow justify="center">
    <VDialog
      v-model="props.dialog"
      scrollable
      width="400"
    >
      <VCard>
        <VCardTitle>
          Select Columns
        </VCardTitle>
        <VDivider />
        <VCheckbox
          v-model="selectAll"
          class="mx-3"
          label="Select All"
          color="primary"
        />
        <VDivider />
        <VCardText style="height: 300px;">
          <VRow>
            <VCol
              v-for="(column, index) in columns"
              :key="index"
              cols="12"
              class="mx-2"
            >
              <VCheckbox
                v-model="selected"
                :label="splitPacalCase(column)"
                :value="column"
                color="primary"
              />
            </VCol>
          </VRow>
        </VCardText>
        <VDivider class="mb-1" />
        <VCardActions class="mb-1">
          <VBtn
            color="primary"
            variant="text"
            @click="exportData"
          >
            Export
          </VBtn>

          <VBtn
            color="error"
            variant="text"
            @click="emit('close')"
          >
            Close
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>
</template>
