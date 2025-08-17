import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import type { AppSettings } from '@/core/models/AppSettings'


export type AppSettingsStore = {
  appSettings: Ref<AppSettings>;

  setVersion(version: string): void;
}


export const useAppSettingsStore = defineStore<string, AppSettingsStore>('appSettings', () => {

  const appSettings = ref({
    drawerVisible: true,
    version: '0.0.0.0',
    csvSettings: {}
  })

  function setVersion(version: string) {
    appSettings.value = {
      ...appSettings.value,
      version
    };
  }

  return {
    appSettings,
    setVersion
  };
}, {
  persist: {
    storage: sessionStorage
  },
});
