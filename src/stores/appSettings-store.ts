import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'

export type AppSettings = {
  drawerVisible: boolean;
}


export type AppSettingsStore = {
  appSettings: Ref<AppSettings>;
}


export const useAppSettingsStore = defineStore<string, AppSettingsStore>('appSettings', () => {

  const appSettings = ref({
    drawerVisible: true
  })

  return {
    appSettings
  };
});

