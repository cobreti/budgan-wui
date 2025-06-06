import type { CSVSettings, CSVSettingsList } from '@/core/models/csvDocument'
import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type CsvSettingsStore = {
    settings: Ref<CSVSettingsList>
    addSetting: (setting: CSVSettings) => void
    removeSetting: (id: string) => void
    getSettings: (id: string) => CSVSettings | undefined
}

export const useCsvSettingsStore = defineStore<string, CsvSettingsStore>(
    'csvSettings',
    () => {
        const settings = ref<CSVSettingsList>([])

        function addSetting(setting: CSVSettings) {
            settings.value.push(setting)
        }

        function removeSetting(id: string) {
            settings.value = settings.value.filter((setting) => setting.id !== id)
        }

        function getSettings(id: string): CSVSettings | undefined {
            return settings.value.find((setting) => setting.id === id)
        }

        return {
            settings,
            addSetting,
            removeSetting,
            getSettings
        }
    },
    {
        persist: {
            storage: localStorage
        }
    }
)
