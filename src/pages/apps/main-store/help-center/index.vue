<script setup lang="ts">
import debounce from 'lodash.debounce'

import type {
  HelpCenterCategoriesType,
} from '@/@fake-db/types'

import type HelpCenterArticlesOverviewType from '@/types/HelpCenterArticlesOverviewType'

import AppSearchHeader from '@/views/base/AppSearchHeader.vue'
import HelpCenterLandingArticlesOverview from '@/views/pages/help-center/HelpCenterLandingArticlesOverview.vue'
import HelpCenterLandingFooter from '@/views/pages/help-center/HelpCenterLandingFooter.vue'
import HelpCenterLandingKnowledgeBase from '@/views/pages/help-center/HelpCenterLandingKnowledgeBase.vue'
import axios from '@axios'

interface ApiDataType {
  popularArticles: HelpCenterArticlesOverviewType[]
}

const apiData = ref<ApiDataType>()
const search = ref('search')

const fetchHelpCenterData = () => {
  apiData.value = {
    popularArticles: [
      {
        img: 'ph-device-mobile-speaker',
        title: 'Devices',
        subtitle: 'regulate IMEI devices',
      },
      {
        img: 'ph-cards',
        title: 'Cards',
        subtitle: 'regulate SIM cards',
      },
      {
        img: 'ph-shapes',
        title: 'Accessories',
        subtitle: 'regulate accessories for devices',
      },
    ],
  }
}

// this function to search on device and cards and accessorice
const searchVal = debounce((value: unknown, type: unknown) => {
}, 2000)// /searchVal

fetchHelpCenterData()
</script>

<template>
  <VCard v-if="apiData">
    <AppSearchHeader
      v-model="search"
      title="Hello, how can I help?"
      subtitle="You can search by devices, cards, and accessories"
      custom-class="rounded-0"
      @searchVal="searchVal"
    />

    <!-- 👉 Store materials -->
    <VCardText class="py-12">
      <h5 class="text-h5 text-center my-6">
        Store materials
      </h5>

      <HelpCenterLandingArticlesOverview :articles="apiData.popularArticles" />
    </VCardText>

    <!-- 👉 Knowledge Base -->
    <div>
      <VCardText class="bg-var-theme-background py-12">
        <h5 class="text-h5 text-center my-6">
          Knowledge Base
        </h5>

        <HelpCenterLandingKnowledgeBase :categories="apiData.categories" />
      </VCardText>
    </div>

    <!-- 👉 Keep Learning -->
    <!--
      <VCardText class="py-12">
      <h5 class="text-h5 text-center my-6">
      Keep Learning
      </h5>

      <HelpCenterLandingArticlesOverview :articles="apiData.keepLearning" />
      </VCardText>
    -->

    <!-- 👉 Still need help? -->
    <HelpCenterLandingFooter />
  </VCard>
</template>

<route lang="yaml">
meta:
  action: manage
  subject: Auth
</route>

