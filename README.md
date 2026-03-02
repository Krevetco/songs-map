# Карта деревень с музыкальными треками

MVP веб-приложение для отображения деревень и сёл России на интерактивной карте с музыкальными треками.

## Технологии

- **Vue 3** + **TypeScript** - фреймворк и язык
- **Vite** - сборщик
- **Tailwind CSS** - стилизация
- **Leaflet** - картографическая библиотека
- **Leaflet.markercluster** - кластеризация маркеров

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр production сборки
npm run preview
```

## Функциональность

### Карта
- ✅ Интерактивная карта России с тайлами OpenStreetMap
- ✅ Управление колесом мыши (scroll zoom)
- ✅ Pinch-zoom на мобильных устройствах
- ✅ Кнопки zoom +/-
- ✅ Ограничение области просмотра границами России

### Маркеры и кластеры
- ✅ Автоматическая кластеризация точек при отдалении
- ✅ Клик по кластеру открывает список деревень (не зумит карту)
- ✅ Tooltip с названием при наведении на маркер
- ✅ Плавная анимация перехода к выбранной деревне (flyTo)

### UI
- ✅ Адаптивные панели:
  - Mobile: bottom sheet с максимальной высотой 60vh
  - Desktop: боковая панель справа (фиксированная ширина 380px)
- ✅ Список деревень в кластере с сортировкой по алфавиту
- ✅ Карточка деревни с треками и ссылкой на скачивание
- ✅ Плавные transitions (Vue Transition)
- ✅ Минималистичный дизайн на Tailwind CSS

### Данные
- ✅ 14 населенных пунктов из разных регионов России
- ✅ Валидация данных с фильтрацией некорректных записей
- ✅ Обработка ошибок загрузки с возможностью повтора

## Структура проекта

```
src/
  components/
    MapView.vue       # Компонент карты с Leaflet
    VillageCard.vue   # Карточка деревни
    VillageList.vue   # Список деревень в кластере
  composables/
    useVillages.ts    # Загрузка и валидация данных
  types/
    village.ts        # TypeScript типы и валидация
  App.vue             # Главный компонент
  main.ts             # Точка входа
  index.css           # Tailwind директивы
public/
  data/
    villages.json     # Данные о деревнях
```

## Конфигурация

Переменные окружения в `.env`:

```env
VITE_TILE_URL_TEMPLATE=https://tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_TILE_ATTRIBUTION_HTML=© OpenStreetMap contributors
VITE_TILE_MAX_ZOOM=19
```

## Формат данных

Файл `public/data/villages.json` содержит массив объектов:

```typescript
interface Village {
  id: string
  name: string
  type: 'village' | 'selo' | 'poselok'
  region: string
  coordinates: {
    lat: number  // [-90, 90]
    lon: number  // [-180, 180]
  }
  tracks: Array<{
    title: string
    artist: string
  }>
  downloadUrl: string
}
```

## Особенности реализации

### Leaflet иконки
В `main.ts` реализован фикс для корректного отображения иконок маркеров при использовании Vite (импорт PNG через Vite вместо стандартных путей Leaflet).

### Кластеризация
Настройки markercluster:
- `zoomToBoundsOnClick: false` - клик открывает список, а не зумит
- `maxClusterRadius: 60` - меньший радиус для раннего распада кластеров
- `chunkedLoading: true` - производительность при больших данных

### Адаптивность
- Mobile-first подход
- Breakpoint для desktop: `md:` (768px)
- Поддержка `safe-area-inset-bottom` для современных мобильных устройств

## Лицензия и атрибуция

При использовании тайлов OpenStreetMap необходимо:
- Отображать атрибуцию "© OpenStreetMap contributors"
- Не скрывать атрибуцию под UI элементами
- Соблюдать [Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)

Для продакшена рекомендуется использовать коммерческие тайл-провайдеры (Mapbox, MapTiler) или собственный тайл-сервер.

## Дальнейшее развитие

Возможные улучшения:
- [ ] Поиск по названию деревни
- [ ] Фильтрация по регионам/типам
- [ ] Аудиоплеер для прослушивания треков
- [ ] Админ-панель для управления данными
- [ ] Backend API вместо статичного JSON
- [ ] Деплой на GitHub Pages/Netlify/Vercel
