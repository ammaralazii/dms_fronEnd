<script setup lang="ts">
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
  title: {
    required: true,
    type: String,
  },
})// /props

const emit = defineEmits(['close', 'confirm'])

const closeDialog = () => {
  emit('close')
}

const deleteItem = () => {
  emit('confirm')
}
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
