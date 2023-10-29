<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { can } from '@layouts/plugins/casl'

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
        lg="12"
        md="12"
        sm="12"
        xs="12"
      >
        <VList
          class="pa-5 d-flex"
          color="primary"
        >
          <template
            v-for="(step, index) in steps"
            :key="index"
          >
            <VListItem
              v-if="$can(step.action, step.subject)"
              color="primary"
              :active="controller[index]"
              link
              rounded
              :class="screen.smAndDown.value ? 'mx-1 iconItem' : 'my-1 iconItem'"
              :disabled="step.disabled"
              @click="dispalyComponent(index)"
            >
              <VListItemTitle
                class="text-capitalize"
                :style="screen.smAndDown.value ? '' : 'display: grid;'"
              >
                <VIcon
                  size="x-large"
                  class="ma-auto"
                >
                  {{ step.icon }}
                </VIcon>
                {{ screen.smAndDown.value ? '' : step.title.replace('_', ' ') }}
              </VListItemTitle>
            </VListItem>
            <VSpacer
              v-if="index !== steps.length - 1"
              class="d-flex align-center justify-center"
            >
              <VIcon
                class="ma-auto"
                size="x-large"
                :color="controller[index + 1] ? 'primary' : ''"
              >
                ph-caret-right
              </VIcon>
            </VSpacer>
          </template>
        </VList>
      </VCol>
      <VCol
        cols="12"
        lg="12"
        md="12"
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
                  :disabled="activeIndex === 0"
                  @click="dispalyComponent(activeIndex - 1)"
                >
                  Previous
                </VBtn>
                <VBtn
                  :disabled="activeIndex === steps.length - 1"
                  @click="dispalyComponent(activeIndex + 1)"
                >
                  Next
                </VBtn>
              </VCardActions>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>

<style lang="scss">
.iconItem {
  .v-list-item__overlay {
    display: none !important;
  }

  svg {
    block-size: 3rem;
    inline-size: 3rem;
  }
}
</style>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>
