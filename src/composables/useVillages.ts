import { ref } from 'vue'
import type { Village } from '../types/village'
import { normalizeVillages } from '../types/village'

export function useVillages() {
  const villages = ref<Village[]>([])
  const loading = ref(false)
  const error = ref<string>('')

  async function loadVillages(): Promise<void> {
    loading.value = true
    error.value = ''
    
    try {
      const response = await fetch('/data/villages.json', {
        headers: { Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error(`Не удалось загрузить данные: ${response.status} ${response.statusText}`)
      }

      const raw = await response.json()
      villages.value = normalizeVillages(raw)

      if (villages.value.length === 0) {
        throw new Error('Данные загружены, но не содержат корректных записей')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err)
      villages.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    villages,
    loading,
    error,
    loadVillages,
  }
}
