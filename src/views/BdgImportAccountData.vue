<template>
  <div>
    <v-card class="d-flex flex-column ma-2 pa-2">
      <div class="d-flex flex-row mb-2">
        <div class="d-flex flex-column justify-center mr-4 mb-4">
          <label for="ofx-file-input">
            File
          </label>
        </div>
        <v-file-input
          id="ofx-file-input"
          class=""
          v-model="files"
          accept=".json"
          :multiple="true"
        ></v-file-input>
      </div>
      
      <!-- Directory selection option -->
      <div class="d-flex flex-row mb-2">
        <div class="d-flex flex-column justify-center mr-4 mb-4">
          <label>
            Directory
          </label>
        </div>
        <v-btn 
          @click="selectDirectory"
          class="mr-2"
        >
          Select Directory
        </v-btn>
        <span v-if="directoryName" class="directory-name">{{ directoryName }}</span>
        
        <!-- Hidden input for directory selection -->
        <input
          ref="directoryInput"
          type="file"
          webkitdirectory
          directory
          style="display: none"
          @change="handleDirectorySelection"
        />
      </div>
      
      <div class="d-flex flex-row justify-center">
        <v-btn
          @click="onImport"
          :disabled="!canImport"
        >Open</v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.directory-name {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.6);
}
</style>


<script setup lang="ts">
  import { useImportAccountsStore } from '@/stores/importAccounts-store'
  import { computed, ref } from 'vue'
  import { useBankAccountsStore } from '@/stores/bankAccounts-store'

  const importAccountsStore = useImportAccountsStore();
  const bankAccountsStore = useBankAccountsStore();

  const files = defineModel<File[]>();
  const directoryInput = ref<HTMLInputElement | null>(null);
  const directoryFiles = ref<File[]>([]);
  const directoryName = ref<string>('');

  const canImport = computed(() => {
    return (files.value && files.value.length > 0) || directoryFiles.value.length > 0;
  });

  async function onImport() {
    if ((files.value && files.value.length > 0) || directoryFiles.value.length > 0) {
      // Clear existing accounts before importing new ones
      bankAccountsStore.clear();
      
      // Process all files from directory selection if available
      const filesToProcess = directoryFiles.value.length > 0 ? 
        directoryFiles.value : 
        files.value || [];
      
      for (const file of filesToProcess) {
        try {
          await importAccountsStore.importAccountFromFile(file);

          if (importAccountsStore.hasAccounts) {
            const accountsIds = Object.keys(importAccountsStore.accounts);
            accountsIds.forEach(accountId => {
              bankAccountsStore.addWithBankAccount(importAccountsStore.accounts[accountId]);
            });
            importAccountsStore.clear();
          }
          else {
            console.log(`No accounts found in file: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error importing file ${file.name}:`, error);
        }
      }
      
      // Reset directory selection
      directoryFiles.value = [];
      directoryName.value = '';
    }
  }

  function selectDirectory() {
    if (directoryInput.value) {
      directoryInput.value.click();
    }
  }

  function handleDirectorySelection(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      // Convert FileList to array
      const filesArray = Array.from(target.files);
      
      // Filter to only include json files
      const jsonFiles = filesArray.filter(file => file.name.toLowerCase().endsWith('.json'));
      
      directoryFiles.value = jsonFiles;
      
      // Get directory name from the first file's path
      if (filesArray.length > 0) {
        const path = filesArray[0].webkitRelativePath;
        directoryName.value = path.split('/')[0] || 'Selected Directory';
      }
      
      // Reset file input
      if (files.value) {
        files.value = [];
      }
    }
  }
</script>
