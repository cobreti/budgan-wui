<template>
  <div>
    <v-toolbar class="pl-5">
      <a @click="$router.go(-1)">
        <v-icon
          size="Large"
          icon="mdi-chevron-left"></v-icon>
      </a>
    </v-toolbar>
    <div class="ma-5 form">
      <v-form>
        <v-text-field
          label="Account Name"
          required
          v-model="accountName"></v-text-field>
        <v-text-field
          label="Account Number"
          required
          v-model="accountNumber"></v-text-field>
        <v-btn
          @click="createAccount"
          color="primary">Create Account</v-btn>
      </v-form>
    </div>
  </div>
</template>

<style scoped>
  a {
    cursor: pointer;
  }

  .form {
    max-width: 40em;
  }
</style>

<script setup lang="ts">

  const accountName = defineModel('accountName', {required: true});
  const accountNumber = defineModel('accountNumber');

  async function createAccount() {
    console.log('test');
  }

</script>

