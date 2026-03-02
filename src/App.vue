<template>
  <div class="relative h-full w-full overflow-hidden bg-gray-100">
    <MapView
      :villages="villages"
      :selectedVillageId="selectedVillage?.id ?? null"
      @selectVillage="handleSelectVillage"
      @selectCluster="handleSelectCluster"
      @closePanels="closePanels"
      class="absolute inset-0"
    />

    <Transition name="slide">
      <div
        v-if="panelMode === 'cluster'"
        class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-xl rounded-t-2xl p-4 md:top-4 md:right-4 md:left-auto md:bottom-4 md:w-96 md:rounded-2xl md:border md:max-h-[calc(100vh-2rem)]"
        style="max-height: 60vh; z-index: 1000;"
      >
        <VillageList
          :villages="clusterVillages"
          @selectVillage="handleSelectVillage"
          @close="closePanels"
        />
      </div>
    </Transition>

    <Transition name="slide">
      <div
        v-if="panelMode === 'village' && selectedVillage"
        class="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-xl rounded-t-2xl p-4 md:top-4 md:right-4 md:left-auto md:bottom-4 md:w-96 md:rounded-2xl md:border md:max-h-[calc(100vh-2rem)]"
        style="max-height: 60vh; z-index: 1000;"
      >
        <VillageCard :village="selectedVillage" @close="closePanels" />
      </div>
    </Transition>

    <Transition name="slide">
      <div
        v-if="error"
        class="absolute bottom-0 left-0 right-0 bg-white border-t border-red-300 shadow-xl rounded-t-2xl p-4 md:top-4 md:right-4 md:left-auto md:bottom-auto md:w-96 md:rounded-2xl md:border"
        style="z-index: 1000;"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-medium text-red-600">Ошибка загрузки</h3>
          <button
            @click="error = ''"
            class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            OK
          </button>
        </div>
        <div class="text-sm text-gray-700 mb-4">{{ error }}</div>
        <button
          @click="reload"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Повторить
        </button>
      </div>
    </Transition>

    <div
      v-if="loading"
      class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      style="z-index: 2000;"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-3"></div>
          <div class="text-sm text-gray-700">Загрузка данных...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MapView from './components/MapView.vue'
import VillageCard from './components/VillageCard.vue'
import VillageList from './components/VillageList.vue'
import { useVillages } from './composables/useVillages'
import type { Village } from './types/village'

const { villages, loading, error, loadVillages } = useVillages()

const selectedVillage = ref<Village | null>(null)
const clusterVillages = ref<Village[]>([])
const panelMode = ref<'cluster' | 'village' | null>(null)

async function reload(): Promise<void> {
  error.value = ''
  await loadVillages()
}

function closePanels(): void {
  panelMode.value = null
  clusterVillages.value = []
  selectedVillage.value = null
}

function handleSelectCluster(data: { villages: Village[]; count: number }): void {
  clusterVillages.value = data.villages
  selectedVillage.value = null
  panelMode.value = 'cluster'
}

function handleSelectVillage(village: Village): void {
  selectedVillage.value = village
  clusterVillages.value = []
  panelMode.value = 'village'
}

onMounted(() => {
  loadVillages()
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(1rem);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
