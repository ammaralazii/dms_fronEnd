<script setup lang="ts">
import { useAlertsStore } from '@/stores'
import { emailValidator, integerValidator, requiredValidator } from '@validators'
import { gender } from '@/types/enum/gender'
import { ethnic } from '@/types/enum/ethnic'

const alert = useAlertsStore()
</script>

<template>
  <VRow>
    <!-- 👉 First Name -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        First Name
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalFirstName"
        :rules="[requiredValidator]"
      />
    </VCol>

    <!-- 👉 Second Name -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Second Name
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalSecondName"
        :rules="[requiredValidator]"
      />
    </VCol>

    <!-- 👉 Third Name -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Third Name
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalTirdName"
        :rules="[requiredValidator]"
      />
    </VCol>

    <!-- 👉 ID number -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        ID number
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalIdNumber"
        :rules="[requiredValidator, integerValidator]"
      />
    </VCol>

    <!-- 👉 ID Date Issued -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        ID Date Issued
      </VLabel>
      <AppDateTimePicker
        v-model="alert.$state.personalInformation.PersonalIDDateIssued"
        :rules="[requiredValidator]"
        append-inner-icon="ph-calendar"
      />
    </VCol>

    <!-- 👉 Date of Birth  -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Date of Birth
      </VLabel>
      <AppDateTimePicker
        v-model="alert.$state.personalInformation.personalBirthDate"
        :rules="[requiredValidator]"
        append-inner-icon="ph-calendar"
      />
    </VCol>

    <!-- 👉 Ethnic  -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel
        class="required"
      >
        Ethnic
      </VLabel>
      <VAutocomplete
        v-model="alert.$state.personalInformation.personalEthnic"
        :rules="[requiredValidator]"
        :items="ethnic"
      />
    </VCol>

    <!-- 👉 Marital Status  -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Marital Status
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalMaritalStatus"
        :rules="[requiredValidator]"
      />
    </VCol>
  </VRow>

  <VRow>
    <!-- 👉 Gender  -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Gender
      </VLabel>
      <VAutocomplete
        v-model="alert.$state.personalInformation.personalGender"
        :items="gender"
        :rules="[requiredValidator]"
      />
    </VCol>

    <!-- 👉 Residency Card ID  -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Residency Card ID
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalResidencyCardID"
        :rules="[requiredValidator]"
      />
    </VCol>
    <!-- 👉 Phone number -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Phone number
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalPhoneNumber"
        :rules="[requiredValidator, integerValidator]"
      />
    </VCol>

    <!-- 👉 Phone number 2 -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel>
        Phone number 2
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.personalPhoneNumber2"
        :rules="[integerValidator]"
      />
    </VCol>

    <!-- 👉 Email -->
    <VCol
      cols="12"
      xl="3"
      md="3"
      sm="12"
      xs="12"
    >
      <VLabel class="required">
        Email
      </VLabel>
      <VTextField
        v-model="alert.$state.personalInformation.PersonalEmail"
        :rules="[requiredValidator, emailValidator]"
      />
    </VCol>
  </VRow>
  <VDivider class="my-4" />
</template>

