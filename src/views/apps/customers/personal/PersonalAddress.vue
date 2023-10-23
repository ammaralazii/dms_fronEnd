<script setup lang="ts">
import { useAlertsStore } from '@/stores'

import { emailValidator, integerValidator, requiredValidator } from '@validators'

const alert = useAlertsStore()
</script>

<template>
  <VSheet
    class="mx-auto pa-4"
    height="auto"
  >
    <VRow>
      <!-- 👉  Street Address Line1 -->
      <VCol
        cols="12"
        xl="4"
        md="4"
        sm="12"
        xs="12"
      >
        <VLabel class="required">
          Street Address Line1
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.PersonalAddressStreetAddressLine1"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- 👉 Street Address Line2 -->
      <VCol
        cols="12"
        xl="4"
        md="4"
        sm="12"
        xs="12"
      >
        <VLabel>
          Street Address Line2
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.PersonalAddressStreetAddressLine2"
        />
      </VCol>

      <!-- 👉 City -->
      <VCol
        cols="12"
        xl="4"
        md="4"
        sm="12"
        xs="12"
      >
        <VLabel class="required">
          City
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.personalAddressCity"
          :rules="[requiredValidator]"
        />
      </VCol>

      <!-- 👉 Suburb -->
      <VCol
        cols="12"
        xl="4"
        md="4"
        sm="12"
        xs="12"
      >
        <VLabel>
          Suburb
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.personalAddressSuburb"
        />
      </VCol>

      <!-- 👉 Province -->
      <VCol
        cols="12"
        xl="3"
        md="3"
        sm="12"
        xs="12"
      >
        <VLabel>
          Province
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.personalAddressProvince"
        />
      </VCol>

      <!-- 👉 Postcode  -->
      <VCol
        cols="12"
        xl="4"
        md="4"
        sm="12"
        xs="12"
      >
        <VLabel>
          Postcode
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.personalAddressPostCode"
        />
      </VCol>

      <!-- 👉 P.O. Box  -->
      <VCol
        cols="12"
        xl="3"
        md="3"
        sm="12"
        xs="12"
      >
        <VLabel>
          P.O. Box
        </VLabel>
        <VTextField
          v-model="alert.$state.personalInformation.persnoalAddressPOBox"
        />
      </VCol>
    </VRow>
  </VSheet>
</template>

