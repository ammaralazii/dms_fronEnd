<script setup lang="ts">
const props = defineProps({
  dialog: {
    required: true,
    type: Boolean,
  },
})
</script>

<template>
  <VDialog
    v-model="props.dialog"
    :scrim="false"
    persistent
    width="auto"
  >
    <VCard
      color="primary"
    >
      <VCardText>
        The files are being retrieved, please wait
        <VProgressLinear
          indeterminate
          color="white"
          class="mb-0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
