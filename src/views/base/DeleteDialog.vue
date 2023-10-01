<script setup lang="ts">
import axiosIns from '@/plugins/axios'
import hundlerErorr from '@/helper/hundlerErorr'

const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  title: {
    required: true,
    type: String,
  },
  data: {
    required: true,
    type: Array,
  },
  url: {
    required: true,
    type: String,
  },
})// /props

const emit = defineEmits(['close', 'confirm'])

const closeDialog = () => {
  emit('close')
}

const deleteItem = async () => {
  try {
    let result = null
    result = await axiosIns.delete(props.url, {
      data: props.data as any,
    }) as any

    if (result && result.data.success === true)
      emit('confirm', props.data)
  }
  catch (e) {
    hundlerErorr(e)
  }
}// /deleteItem
</script>

<template>
  <VDialog
    v-model="props.dialog"
    width="400"
  >
    <VCard>
      <VCardTitle class="headline">
        Confirm Delete
      </VCardTitle>
      <VCardText>
        {{ title }}
      </VCardText>
      <VCardActions>
        <VBtn
          color="error"
          @click="deleteItem"
        >
          Delete
        </VBtn>
        <VBtn
          color="primary"
          @click="closeDialog"
        >
          Cancel
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>

</style>
