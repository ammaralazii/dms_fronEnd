<script setup lang="ts">
import type {
  HelpCenterArticlesOverviewType,
} from '@/@fake-db/types'

interface Props {
  articles: HelpCenterArticlesOverviewType[]
}

const props = defineProps<Props>()
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="10"
      class="mx-auto mb-8"
    >
      <VRow>
        <VCol
          v-for="article in props.articles"
          :key="article.title"
          cols="12"
          md="4"
        >
          <VCard
            flat
            border
          >
            <VCardText class="text-center">
              <VIcon size="58">
                {{ article.img }}
              </VIcon>

              <h6 class="text-h6 my-3">
                {{ article.title }}
              </h6>
              <p>
                {{ article.subtitle }}
              </p>

              <VBtn
                variant="tonal"
              >
                +2000
              </VBtn>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </VCol>
  </VRow>
</template>
