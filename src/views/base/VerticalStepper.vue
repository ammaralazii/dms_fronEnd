<script setup lang="ts">
import { useDisplay } from 'vuetify'

const props = defineProps({
  steps: {
    required: true,
    type: Array as () => Array<Record<string, any>>,
  },
  btn: {
    required: false,
    type: Boolean,
  },
})

const activeIndex = ref(0)

const screen = useDisplay()

const controller: any = ref([])

onMounted(() => {
  props.steps.forEach((item, i: number) => {
    if (controller.value.length === 0)
      controller.value[i] = true
    else
      controller.value[i] = false
  })
})

const dispalyComponent = (index: number) => {
  controller.value.forEach((item: any, i) => {
    if (i !== index) { controller.value[i] = false }
    else {
      activeIndex.value = i
      controller.value[i] = true
    }
  })
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        lg="3"
        md="3"
        sm="12"
        xs="12"
      >
        <VList
          class="pa-2"
          :class="screen.smAndDown.value ? 'd-flex' : ''"
          color="primary"
        >
          <VListItem
            v-for="(step, index) in steps"
            :key="index"
            color="primary"
            :active="controller[index]"
            link
            rounded
            :class="screen.smAndDown.value ? 'mx-1' : 'my-1'"
            :disabled="step.disabled"
            @click="dispalyComponent(index)"
          >
            <template
              #prepend
            >
              <VIcon :class="screen.xs.value ? 'ma-auto' : ''">
                {{ step.icon }}
              </VIcon>
            </template>
            <VListItemTitle
              v-if="!screen.xs.value"
              class="text-capitalize"
            >
              {{ step.title.replace('_', ' ') }}
            </VListItemTitle>
          </VListItem>
        </VList>
      </VCol>
      <VCol
        cols="12"
        lg="9"
        md="9"
        sm="12"
        xs="12"
      >
        <template
          v-for="(step, index) in steps"
          :key="index"
        >
          <slot
            v-if="controller[index]"
            :name="step.title"
          />
        </template>
        <VRow v-if="btn">
          <VCol
            cols="12"
            lg="12"
            xl="12"
            md="12"
            sm="12"
            xs="12"
          >
            <VCard
              width="100%"
            >
              <VCardActions class="d-flex justify-space-between">
                <VBtn
                  :disabled="activeIndex === steps.length - 1"
                  @click="dispalyComponent(activeIndex + 1)"
                >
                  Next
                </VBtn>
                <VBtn
                  :disabled="activeIndex === 0"
                  @click="dispalyComponent(activeIndex - 1)"
                >
                  Previous
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
