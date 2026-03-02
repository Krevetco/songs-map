<template>
  <div class="flex flex-col h-full">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-medium">{{ village.name }}</h3>
      <button
        @click="$emit('close')"
        class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Закрыть
      </button>
    </div>

    <div class="text-sm text-gray-600 mb-4">{{ village.region }}</div>

    <div class="flex-1 overflow-auto">
      <div class="mb-2 text-sm font-medium text-gray-700">
        Треки ({{ village.tracks.length }})
      </div>
      <ul v-if="village.tracks.length > 0" class="space-y-2">
        <li
          v-for="(track, idx) in village.tracks"
          :key="idx"
          class="p-3 border border-gray-200 rounded-lg"
        >
          <div class="font-medium">{{ track.title }}</div>
          <div v-if="track.artist" class="text-sm text-gray-600 mt-1">
            {{ track.artist }}
          </div>
        </li>
      </ul>
      <div v-else class="p-4 border border-gray-200 rounded-lg text-gray-600">
        <div>Треки пока не указаны</div>
        <div class="text-sm mt-1">Но можно открыть папку по ссылке ниже</div>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-gray-200">
      <a
        :href="village.downloadUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
      >
        Открыть треки (внешняя ссылка) →
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Village } from '../types/village'

defineProps<{
  village: Village
}>()

defineEmits<{
  close: []
}>()
</script>
