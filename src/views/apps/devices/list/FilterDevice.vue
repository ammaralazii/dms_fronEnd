<script setup lang="ts">
import debounce from 'lodash/debounce'

const emit = defineEmits(['dataFiltering'])

const fromDate = ref<Date>()
const toDate = ref<Date>()
const type = ref(null)

const dateTimePickerConfig = computed(() => {
  return { enableTime: true, dateFormat: 'Y-m-d H:i' }
})

const types = [
  {
    title: 'Import',
    value: 'DeciveImportDate',
  },
  {
    title: 'Receive',
    value: 'DeviceRecivedDate',
  },
]

const dateFormat = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const day = currentDate.getDate()

  return `${year}-${month + 1}-${day}`
}// /dateFormat

const sendData = debounce(() => {
  emit('dataFiltering', {
    to: toDate.value ? toDate.value : dateFormat(),
    from: fromDate.value ? fromDate.value : '1990-01-01',
    type: type.value,
  })// /emit
}, 3000)

watch(() => type.value, () => sendData())
</script>

<template>
  <VRow>
    <!-- 👉 From date -->
    <VCol
      cols="12"
      sm="4"
    >
      <VLabel>From : </VLabel>
      <AppDateTimePicker
        :key="JSON.stringify(dateTimePickerConfig)"
        v-model:model-value="fromDate"
        clearable
        :config="dateTimePickerConfig"
        append-inner-icon="ph-calendar"
        @input="sendData"
      />
    </VCol>

    <!-- 👉 To date -->
    <VCol
      cols="12"
      sm="4"
    >
      <VLabel>To : </VLabel>
      <AppDateTimePicker
        :key="JSON.stringify(dateTimePickerConfig)"
        v-model:model-value="toDate"
        clearable
        :config="dateTimePickerConfig"
        append-inner-icon="ph-calendar"
        @input="sendData"
      />
    </VCol>

    <!-- 👉 To date -->
    <VCol
      cols="12"
      sm="4"
    >
      <VLabel>Type : </VLabel>
      <VSelect
        v-model="type"
        clearable
        :items="types"
        :item-title="(item) => item.title"
        :item-value="(item) => item.value"
      />
    </VCol>
  </VRow>
</template>
