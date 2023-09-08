<script setup lang="ts">
import AppSearchHeaderBg from '@images/pages/app-search-header-bg.png'

interface Props {
  title?: string
  subtitle?: string
  customClass?: string
}

const props = defineProps<Props>()

const emit = defineEmits(['searchVal'])

const searchTypes = [
  {
    key: 'All items',
    value: 0,
  },
  {
    key: 'Devises',
    value: 1,
  },
  {
    key: 'Cards',
    value: 2,
  },
  {
    key: 'Accessories',
    value: 3,
  },
]

const selectedItem = ref(searchTypes[0])

const saerch = ref()

watch(() => saerch.value, (val: any) => {
  emit('searchVal', val, selectedItem.value)
})// /watch

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <!-- 👉 Search Banner  -->
  <VCard
    flat
    class="text-center search-header"
    :class="props.customClass"
    :style="`background: url(${AppSearchHeaderBg});`"
  >
    <VCardText>
      <h5 class="text-h5 font-weight-semibold">
        {{ props.title }}
      </h5>

      <!-- 👉 Search Input -->
      <VTextField
        v-model="saerch"
        placeholder=""
        class="search-header-input mx-auto my-3"
        density="comfortable"
      >
        <template #prepend-inner>
          <VIcon
            icon="tabler-search"
            size="23"
          />
        </template>

        <template #append>
          <VSelect
            v-model="selectedItem"
            :items="searchTypes"
            :item-title="(item) => item.key"
            :item-value="(item) => item.value"
          />
        </template>
      </VTextField>

      <p class="mb-0">
        {{ props.subtitle }}
      </p>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.search-header {
  padding: 4rem !important;
  background-size: cover !important;

  .v-input__append {
    padding: 0;
    margin-inline-start: 2px;

    .v-field {
      padding-block: 2px 0;
      padding-inline: 2px 5px;
    }

    .v-field__input {
      display: inline-block;
      overflow: hidden !important;
      inline-size: 100px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

// search input
.search-header-input {
  border-radius: 0.25rem !important;
  border-radius: 0.375rem !important;
  background-color: rgb(var(--v-theme-surface));
  max-inline-size: 40.125rem !important;

  .v-field__prepend-inner {
    i {
      inset-block-start: 3px !important;
    }
  }
}

@media (max-width: 37.5rem) {
  .search-header {
    padding: 1.5rem !important;

    .v-input__append {
      padding: 0;
      margin-inline-start: 2px;

      .v-field {
        padding-block: 2px 0;
        padding-inline: 2px 5px;
      }

      .v-field__input {
        display: inline-block;
        overflow: hidden !important;
        inline-size: 50px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
