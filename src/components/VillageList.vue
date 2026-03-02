<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium">
        Деревни в кластере ({{ sortedVillages.length }})
      </h3>
      <button
        @click="$emit('close')"
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Закрыть
      </button>
    </div>

    <ul class="flex-1 overflow-auto space-y-2">
      <li
        v-for="village in sortedVillages"
        :key="village.id"
        @click="$emit('selectVillage', village)"
        class="p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-all"
      >
        <div class="font-medium">{{ village.name }}</div>
        <div class="text-sm text-gray-600 mt-1">
          {{ village.region }} · треков: {{ village.tracks.length }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Village } from '../types/village'

const props = defineProps<{
  villages: Village[]
}>()

defineEmits<{
  selectVillage: [village: Village]
  close: []
}>()

const sortedVillages = computed(() => {
  return [...props.villages].sort((a, b) => 
    a.name.localeCompare(b.name, 'ru')
  )
})
</script>
