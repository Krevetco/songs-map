<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import * as L from 'leaflet'
import 'leaflet.markercluster'
import type { Village } from '../types/village'

const props = defineProps<{
  villages: Village[]
  selectedVillageId: string | null
}>()

const emit = defineEmits<{
  selectVillage: [village: Village]
  selectCluster: [data: { villages: Village[]; count: number }]
  closePanels: []
}>()

const mapContainer = ref<HTMLElement | null>(null)

let map: L.Map | null = null
let tileLayer: L.TileLayer | null = null
let clusterGroup: L.MarkerClusterGroup | null = null

const markerById = new Map<string, L.Marker>()

const TILE_URL = import.meta.env.VITE_TILE_URL_TEMPLATE || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTR = import.meta.env.VITE_TILE_ATTRIBUTION_HTML || '© OpenStreetMap contributors'
const TILE_MAX_ZOOM = Number(import.meta.env.VITE_TILE_MAX_ZOOM || 19)

function initMap(): void {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value, {
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: true,
    touchZoom: true,
    bounceAtZoomLimits: false,
    minZoom: 3,
    maxZoom: 18,
    worldCopyJump: true,
  })

  tileLayer = L.tileLayer(TILE_URL, {
    attribution: TILE_ATTR,
    maxZoom: TILE_MAX_ZOOM,
  })

  tileLayer.addTo(map)

  map.setView([62.0, 105.0], 3)

  clusterGroup = L.markerClusterGroup({
    zoomToBoundsOnClick: true,
    showCoverageOnHover: false,
    chunkedLoading: true,
    chunkInterval: 200,
    chunkDelay: 50,
    maxClusterRadius: 60,
    removeOutsideVisibleBounds: true,
  })

  clusterGroup.on('click', (event: L.LeafletEvent) => {
    const marker = (event as any).layer as L.Marker & { __village?: Village }
    const village = marker?.__village
    if (village) {
      emit('selectVillage', village)
    }
  })

  clusterGroup.addTo(map)

  map.on('click', () => {
    emit('closePanels')
  })
}

function setMarkers(villages: Village[]): void {
  if (!clusterGroup) return

  clusterGroup.clearLayers()
  markerById.clear()

  for (const village of villages) {
    const marker = L.marker([village.coordinates.lat, village.coordinates.lon], {
      title: village.name,
    }) as L.Marker & { __village?: Village }

    marker.__village = village

    marker.bindTooltip(village.name, {
      direction: 'top',
      opacity: 0.85,
    })

    markerById.set(village.id, marker)
    clusterGroup.addLayer(marker)
  }
}

function focusVillageById(id: string | null): void {
  if (!id || !map) return

  const marker = markerById.get(id)
  if (!marker) return

  const village = (marker as any).__village as Village | undefined
  if (!village) return

  map.panTo([village.coordinates.lat, village.coordinates.lon], {
    animate: true,
    duration: 0.35,
  })
}

onMounted(() => {
  initMap()
  setMarkers(props.villages)
})

watch(
  () => props.villages,
  (newVillages) => {
    setMarkers(newVillages)
  },
  { deep: true }
)

watch(
  () => props.selectedVillageId,
  (newId) => {
    focusVillageById(newId)
  }
)

onBeforeUnmount(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>
