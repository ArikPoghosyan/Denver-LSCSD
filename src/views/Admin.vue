<template>
  <div class="admin">
    <div class="admin__grid" aria-hidden="true"></div>
    
    <div class="admin__container">
      <!-- Header -->
      <div class="admin__header">
        <div class="admin__header-left">
          <h1 class="admin__title">Панель управления</h1>
          <p class="admin__subtitle">Los Santos County Sheriff's Department</p>
        </div>
        <div class="admin__header-right">
          <div class="admin__leader-badge" :class="{ 'admin__leader-badge--user': !isLeader }">
            <span class="admin__leader-icon">{{ isLeader ? '⬢' : '⬡' }}</span>
            <span>{{ isLeader ? 'Лидер департамента' : 'Сотрудник' }}</span>
          </div>
          <button @click="handleLogout" class="admin__logout">
            <span>Выйти</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 1L13 5M13 5L9 9M13 5H5M1 13V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="admin__stats">
        <div class="admin__stat">
          <span class="admin__stat-value">{{ stats.totalOfficers }}</span>
          <span class="admin__stat-label">Всего пропусков</span>
        </div>
        <div class="admin__stat">
          <span class="admin__stat-value">{{ stats.activeOfficers }}</span>
          <span class="admin__stat-label">Активных пропусков</span>
        </div>
        <div class="admin__stat" v-if="isLeader">
          <span class="admin__stat-value">{{ stats.activeKeys }}</span>
          <span class="admin__stat-label">Активных ключей</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin__tabs">
        <button 
          class="admin__tab" 
          :class="{ 'admin__tab--active': activeTab === 'registry' }"
          @click="activeTab = 'registry'"
        >
          <span class="admin__tab-icon">📋</span>
          Реестр пропусков
        </button>
        <button 
          v-if="isLeader"
          class="admin__tab" 
          :class="{ 'admin__tab--active': activeTab === 'keys' }"
          @click="activeTab = 'keys'"
        >
          <span class="admin__tab-icon">🔑</span>
          Ключи доступа
        </button>
      </div>

      <!-- Registry Tab -->
      <div v-if="activeTab === 'registry'" class="admin__tab-content">
        <div class="admin__toolbar">
          <button class="admin__btn admin__btn--primary" @click="showAddOfficerModal = true">
            <span>➕</span>
            Оформить новый пропуск
          </button>
          <div class="admin__search">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Поиск по имени, фамилии или ID карты..."
              class="admin__search-input"
            />
          </div>
        </div>

        <!-- Officers Table -->
        <div class="admin__table-container">
          <table class="admin__table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>ID карта</th>
                <th>Статус доступа</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredOfficers.length === 0">
                <td colspan="5" style="text-align: center; color: var(--muted); padding: 60px;">
                  Нет записей в реестре
                </td>
              </tr>
              <tr v-for="officer in filteredOfficers" :key="officer.id">
                <td>{{ officer.firstName }}</td>
                <td>{{ officer.lastName }}</td>
                <td>
                  <div class="admin__id-card">
                    <span class="admin__id-prefix">LSSD-</span>
                    <span class="admin__id-number">{{ officer.idCard }}</span>
                  </div>
                </td>
                <td>
                  <span class="admin__status" :class="`admin__status--${officer.status.toLowerCase()}`">
                    {{ officer.status === 'ACTIVE' ? 'ДОСТУП РАЗРЕШЕН' : 'ДОСТУП ЗАКРЫТ' }}
                  </span>
                </td>
                <td>
                  <div class="admin__actions">
                    <button class="admin__action-btn" @click="editOfficer(officer)" title="Редактировать">✏️</button>
                    <button class="admin__action-btn" @click="toggleStatus(officer)" :title="officer.status === 'ACTIVE' ? 'Закрыть доступ' : 'Открыть доступ'">
                      {{ officer.status === 'ACTIVE' ? '🔒' : '🔓' }}
                    </button>
                    <button class="admin__action-btn" @click="deleteOfficer(officer.id)" title="Удалить">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Keys Tab (только для лидера) -->
<div v-if="activeTab === 'keys' && isLeader" class="admin__tab-content">
  <div class="admin__toolbar">
    <button class="admin__btn admin__btn--primary" @click="showGenerateKeyModal = true">
      <span>🔑</span>
      Сгенерировать новый ключ
    </button>
    <div class="admin__key-stats">
      <span class="admin__key-stat">
        <span class="admin__key-stat-value">{{ stats.activeKeys }}</span>
        Активных ключей
      </span>
    </div>
  </div>

  <!-- Keys Table -->
  <div class="admin__table-container">
    <table class="admin__table">
      <thead>
        <tr>
          <th>Код доступа</th>
          <th>Создан</th>
          <th>Статус</th>
          <th>Последнее использование</th>
          <th>Всего использований</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="accessKeys.length === 0">
          <td colspan="6" style="text-align: center; color: var(--muted); padding: 60px;">
            Нет сгенерированных ключей
          </td>
        </tr>
        <tr v-for="key in accessKeys" :key="key.code">
          <td class="admin__key-code">{{ key.code }}</td>
          <td>{{ formatDate(key.createdAt) }}</td>
          <td>
            <span class="admin__status" :class="`admin__status--${key.active ? 'active' : 'inactive'}`">
              {{ key.active ? 'АКТИВЕН' : 'ДЕАКТИВИРОВАН' }}
            </span>
          </td>
          <td>{{ key.lastUsed ? formatDateTime(key.lastUsed) : '—' }}</td>
          <td class="admin__key-uses">
            <span class="admin__uses-badge">{{ key.uses || 0 }}</span>
          </td>
          <td>
            <div class="admin__actions">
              <button class="admin__action-btn" @click="copyKey(key.code)" title="Копировать">📋</button>
              <button 
                class="admin__action-btn" 
                @click="toggleKeyStatus(key)" 
                :title="key.active ? 'Деактивировать' : 'Активировать'"
              >
                {{ key.active ? '🔴' : '🟢' }}
              </button>
              <button class="admin__action-btn" @click="deleteKey(key)" title="Удалить навсегда">🗑️</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
</div>
      </div>
    </div>

    <!-- Modal: Add/Edit Officer -->
    <Transition name="modal">
      <div v-if="showAddOfficerModal" class="admin__modal-overlay" @click.self="showAddOfficerModal = false">
        <div class="admin__modal">
          <div class="admin__modal-header">
            <h3>{{ editingOfficer ? 'Редактировать пропуск' : 'Оформить новый пропуск' }}</h3>
            <button class="admin__modal-close" @click="showAddOfficerModal = false">×</button>
          </div>
          <form @submit.prevent="saveOfficer" class="admin__modal-form">
            <div class="admin__form-grid">
              <label class="admin__form-field">
                <span>Имя</span>
                <input v-model="officerForm.firstName" required class="admin__form-input" />
              </label>
              <label class="admin__form-field">
                <span>Фамилия</span>
                <input v-model="officerForm.lastName" required class="admin__form-input" />
              </label>
              <label class="admin__form-field">
                <span>ID карта</span>
                <div class="admin__id-input-group">
                  <span class="admin__id-prefix-input">LSSD-</span>
                  <input v-model="officerForm.idCard" required class="admin__id-input" placeholder="000000" maxlength="6" />
                </div>
              </label>
              <label class="admin__form-field">
                <span>Статус доступа</span>
                <select v-model="officerForm.status" required class="admin__form-select">
                  <option value="ACTIVE">Доступ разрешен</option>
                  <option value="INACTIVE">Доступ закрыт</option>
                </select>
              </label>
            </div>
            <div class="admin__modal-actions">
              <button type="button" class="admin__btn admin__btn--secondary" @click="showAddOfficerModal = false">
                Отмена
              </button>
              <button type="submit" class="admin__btn admin__btn--primary">
                {{ editingOfficer ? 'Сохранить' : 'Оформить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Modal: Generate Key (только для лидера) -->
    <Transition name="modal">
      <div v-if="showGenerateKeyModal && isLeader" class="admin__modal-overlay" @click.self="showGenerateKeyModal = false">
        <div class="admin__modal">
          <div class="admin__modal-header">
            <h3>Сгенерировать ключ доступа</h3>
            <button class="admin__modal-close" @click="showGenerateKeyModal = false">×</button>
          </div>
          <form @submit.prevent="generateKey" class="admin__modal-form">
            <p class="admin__modal-note">Ключ будет сгенерирован в формате XXXX-XXXX (8 символов)</p>

            <div v-if="generatedKey" class="admin__generated-key">
              <span class="admin__key-label">Сгенерированный ключ:</span>
              <div class="admin__key-display">
                <code>{{ generatedKey }}</code>
                <button type="button" class="admin__key-copy" @click="copyKey(generatedKey)">📋 Копировать</button>
              </div>
            </div>

            <div class="admin__modal-actions">
              <button type="button" class="admin__btn admin__btn--secondary" @click="showGenerateKeyModal = false">
                Закрыть
              </button>
              <button type="submit" class="admin__btn admin__btn--primary" :disabled="isGenerating">
                {{ isGenerating ? 'Генерация...' : 'Сгенерировать' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { loadData, saveData, initDatabase, subscribeToChanges } from '../services/supabase'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const activeTab = ref('registry')
const searchQuery = ref('')
const showAddOfficerModal = ref(false)
const showGenerateKeyModal = ref(false)
const editingOfficer = ref(null)
const isGenerating = ref(false)
const generatedKey = ref('')
const isLeader = ref(false)

// Статистика
const stats = ref({
  totalOfficers: 0,
  activeOfficers: 0,
  activeKeys: 0
})

// Форма сотрудника
const officerForm = ref({
  firstName: '',
  lastName: '',
  idCard: '',
  status: 'ACTIVE'
})

// Данные
const officers = ref([])
const accessKeys = ref([])

// Загрузка данных
onMounted(async () => {
  checkAuth()
  
  // Пробуем подключиться к Supabase
  const connected = await initDatabase()
  
  if (connected) {
    // Загружаем данные из Supabase
    const data = await loadData()
    officers.value = data.officers || []
    accessKeys.value = data.keys || []
    updateStats()
    
    // Подписываемся на изменения (для синхронизации между пользователями)
    const subscription = subscribeToChanges((newData) => {
      officers.value = newData.officers || []
      accessKeys.value = newData.keys || []
      updateStats()
    })
    
    // Отписываемся при размонтировании
    onUnmounted(() => {
      subscription.unsubscribe()
    })
  } else {
    // Fallback на localStorage если Supabase не работает
    console.log('Using localStorage as fallback')
    const savedOfficers = localStorage.getItem('lssd_officers')
    const savedKeys = localStorage.getItem('lssd_keys')
    officers.value = savedOfficers ? JSON.parse(savedOfficers) : []
    accessKeys.value = savedKeys ? JSON.parse(savedKeys) : []
    updateStats()
  }
})

const updateStats = () => {
  stats.value = {
    totalOfficers: officers.value.length,
    activeOfficers: officers.value.filter(o => o.status === 'ACTIVE').length,
    activeKeys: accessKeys.value.filter(k => k.active === true).length
  }
}

// Фильтрация сотрудников
const filteredOfficers = computed(() => {
  if (!searchQuery.value) return officers.value
  
  const query = searchQuery.value.toLowerCase()
  return officers.value.filter(o => 
    o.firstName.toLowerCase().includes(query) ||
    o.lastName.toLowerCase().includes(query) ||
    (o.idCard && o.idCard.toLowerCase().includes(query))
  )
})

// Форматирование даты
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU')
}

// CRUD операции для сотрудников
const saveOfficer = () => {
  // Генерируем ID карты если не указан
  if (!officerForm.value.idCard) {
    officerForm.value.idCard = Math.floor(100000 + Math.random() * 900000).toString()
  }
  
  if (editingOfficer.value) {
    // Обновление
    const index = officers.value.findIndex(o => o.id === editingOfficer.value.id)
    officers.value[index] = { ...editingOfficer.value, ...officerForm.value }
  } else {
    // Добавление
    const newOfficer = {
      id: Date.now().toString(),
      ...officerForm.value,
      createdAt: new Date().toISOString()
    }
    officers.value.push(newOfficer)
  }
  
  saveToStorage()
  showAddOfficerModal.value = false
  resetOfficerForm()
  updateStats()
}

const editOfficer = (officer) => {
  editingOfficer.value = officer
  officerForm.value = { ...officer }
  showAddOfficerModal.value = true
}

const toggleStatus = (officer) => {
  officer.status = officer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  saveToStorage()
  updateStats()
}

const deleteOfficer = (id) => {
  if (confirm('Удалить этот пропуск из реестра?')) {
    officers.value = officers.value.filter(o => o.id !== id)
    saveToStorage()
    updateStats()
  }
}

// Генерация ключа (только для лидера)
// Генерация ключа (только для лидера)
const generateKey = () => {
  if (!isLeader.value) return
  
  isGenerating.value = true
  
  setTimeout(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = ''
    
    for (let i = 0; i < 8; i++) {
      key += chars[Math.floor(Math.random() * chars.length)]
      if (i === 3) key += '-'
    }
    
    generatedKey.value = key
    
    const newKey = {
      code: key,
      createdAt: new Date().toISOString(),
      active: true,           // true - активен, false - деактивирован
      uses: 0,                // счетчик использований
      lastUsed: null,         // дата последнего использования
      history: []             // история использований (опционально)
    }
    
    accessKeys.value.push(newKey)
    saveToStorage()
    updateStats()
    
    isGenerating.value = false
  }, 500)
}

// Переключение статуса ключа (активен/деактивирован)
const toggleKeyStatus = (key) => {
  key.active = !key.active
  saveToStorage()
  updateStats()
}

// Удаление ключа навсегда
const deleteKey = (key) => {
  if (confirm(`Удалить ключ ${key.code} навсегда?`)) {
    accessKeys.value = accessKeys.value.filter(k => k.code !== key.code)
    saveToStorage()
    updateStats()
  }
}

// Форматирование даты и времени
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const copyKey = (key) => {
  navigator.clipboard.writeText(key)
  alert('Ключ скопирован в буфер обмена')
}

const deactivateKey = (key) => {
  if (!isLeader.value) return
  
  if (confirm('Деактивировать этот ключ?')) {
    key.status = 'used'
    saveToStorage()
    updateStats()
  }
}

const handleLogout = () => {
  localStorage.removeItem('lssd_auth')
  router.push('/login')
}

const saveToStorage = async () => {
  const data = {
    officers: officers.value,
    keys: accessKeys.value
  }
  
  // Сохраняем в Supabase
  const saved = await saveData(data)
  
  // Дублируем в localStorage как запасной вариант
  localStorage.setItem('lssd_officers', JSON.stringify(officers.value))
  localStorage.setItem('lssd_keys', JSON.stringify(accessKeys.value))
  
  if (!saved) {
    console.warn('Data saved only to localStorage')
  }
}

const resetOfficerForm = () => {
  officerForm.value = {
    firstName: '',
    lastName: '',
    idCard: '',
    status: 'ACTIVE'
  }
  editingOfficer.value = null
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

.admin {
  min-height: calc(100vh - 120px);
  background: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  position: relative;
  padding: 40px 20px;
}

.admin__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(198,167,86,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(198,167,86,0.03) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: gridShift 20s linear infinite;
}

@keyframes gridShift {
  from { background-position: 0 0; }
  to { background-position: 48px 48px; }
}

.admin__container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Header */
.admin__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(198,167,86,0.2);
}

.admin__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--white);
  margin: 0;
  letter-spacing: 3px;
}

.admin__subtitle {
  color: var(--gold);
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 5px 0 0;
}

.admin__header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.admin__leader-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(198,167,86,0.1);
  border: 1px solid rgba(198,167,86,0.3);
  border-radius: 4px;
  color: var(--gold);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.admin__leader-badge--user {
  border-color: rgba(110, 232, 154, 0.3);
  color: #6ee89a;
  background: rgba(110, 232, 154, 0.1);
}

.admin__leader-icon {
  font-size: 1rem;
}

.admin__logout {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: none;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
}

.admin__logout:hover {
  border-color: var(--gold);
  color: var(--white);
}

/* Stats */
.admin__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.admin__stat {
  background: var(--navy-card);
  border: 1px solid rgba(198,167,86,0.15);
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s;
}

.admin__stat:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3);
}

.admin__stat-value {
  display: block;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--gold);
  margin-bottom: 8px;
}

.admin__stat-label {
  color: var(--muted);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Tabs */
.admin__tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(198,167,86,0.15);
  padding-bottom: 10px;
}

.admin__tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: none;
  border: none;
  color: var(--muted);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.admin__tab--active {
  color: var(--gold);
}

.admin__tab--active::after {
  content: '';
  position: absolute;
  bottom: -11px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.admin__tab-icon {
  font-size: 1.1rem;
}

/* Toolbar */
.admin__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.admin__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.admin__btn--primary {
  background: linear-gradient(135deg, var(--gold), #a8883e);
  color: var(--navy);
}

.admin__btn--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(198,167,86,0.3);
}

.admin__btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.admin__btn--secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(198,167,86,0.2);
  color: var(--white);
}

.admin__btn--secondary:hover {
  border-color: var(--gold);
}

.admin__search {
  flex: 1;
  max-width: 400px;
}

.admin__search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
}

.admin__search-input:focus {
  outline: none;
  border-color: var(--gold);
}

/* Table */
.admin__table-container {
  background: var(--navy-card);
  border: 1px solid rgba(198,167,86,0.15);
  border-radius: 8px;
  overflow-x: auto;
}

.admin__table {
  width: 100%;
  border-collapse: collapse;
}

/* Key stats */
.admin__key-stats {
  display: flex;
  align-items: center;
}

.admin__key-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(198,167,86,0.1);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--muted);
  font-size: 0.85rem;
}

.admin__key-stat-value {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin-right: 5px;
}

/* Key uses badge */
.admin__key-uses {
  text-align: center;
}

.admin__uses-badge {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(198,167,86,0.1);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 12px;
  color: var(--gold);
  font-weight: 600;
  font-size: 0.85rem;
  min-width: 30px;
  text-align: center;
}

/* Status colors */
.admin__status--active {
  background: rgba(110, 232, 154, 0.15);
  border: 1px solid rgba(110, 232, 154, 0.3);
  color: #6ee89a;
}

.admin__status--inactive {
  background: rgba(224, 79, 79, 0.15);
  border: 1px solid rgba(224, 79, 79, 0.3);
  color: #e04f4f;
}

.admin__table th {
  text-align: left;
  padding: 16px;
  background: rgba(0,0,0,0.3);
  color: var(--gold);
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(198,167,86,0.2);
}

.admin__table td {
  padding: 16px;
  color: var(--white);
  border-bottom: 1px solid rgba(198,167,86,0.1);
}

.admin__table tr:last-child td {
  border-bottom: none;
}

.admin__table tr:hover td {
  background: rgba(198,167,86,0.05);
}

/* ID Card Styles */
.admin__id-card {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 0.95rem;
}

.admin__id-prefix {
  color: var(--gold);
  font-weight: 600;
}

.admin__id-number {
  color: var(--white);
  letter-spacing: 1px;
  background: rgba(0,0,0,0.3);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(198,167,86,0.2);
}

/* Status Styles */
.admin__status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.admin__status--active {
  background: rgba(110, 232, 154, 0.15);
  border: 1px solid rgba(110, 232, 154, 0.3);
  color: #6ee89a;
}

.admin__status--inactive {
  background: rgba(224, 79, 79, 0.15);
  border: 1px solid rgba(224, 79, 79, 0.3);
  color: #e04f4f;
}

.admin__status--used {
  background: rgba(240, 237, 232, 0.1);
  border: 1px solid rgba(240, 237, 232, 0.2);
  color: var(--muted);
}

.admin__actions {
  display: flex;
  gap: 8px;
}

.admin__action-btn {
  padding: 6px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.admin__action-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(198,167,86,0.1);
}

/* Key code */
.admin__key-code {
  font-family: monospace;
  font-weight: 700;
  color: var(--gold);
  letter-spacing: 1px;
  font-size: 0.95rem;
}

/* Modal */
.admin__modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.admin__modal {
  width: 500px;
  max-width: 90vw;
  background: var(--navy-mid);
  border: 1px solid var(--gold);
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.admin__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(198,167,86,0.2);
}

.admin__modal-header h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin: 0;
  letter-spacing: 1px;
}

.admin__modal-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.admin__modal-close:hover {
  color: var(--gold);
}

.admin__modal-form {
  padding: 20px;
}

.admin__modal-note {
  color: var(--muted);
  margin-bottom: 20px;
  font-style: italic;
}

.admin__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.admin__form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin__form-field span {
  color: var(--muted);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.admin__form-input,
.admin__form-select {
  padding: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
}

.admin__form-input:focus,
.admin__form-select:focus {
  outline: none;
  border-color: var(--gold);
}

/* ID Input Group */
.admin__id-input-group {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.admin__id-prefix-input {
  padding: 10px 12px;
  background: rgba(198,167,86,0.1);
  color: var(--gold);
  font-weight: 600;
  border-right: 1px solid rgba(198,167,86,0.2);
  font-family: monospace;
}

.admin__id-input {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  color: var(--white);
  font-family: monospace;
  font-size: 1rem;
}

.admin__id-input:focus {
  outline: none;
}

.admin__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Generated key */
.admin__generated-key {
  margin: 20px 0;
  padding: 16px;
  background: rgba(198,167,86,0.1);
  border: 1px solid var(--gold);
  border-radius: 4px;
}

.admin__key-label {
  display: block;
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 8px;
}

.admin__key-display {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.admin__key-display code {
  font-family: monospace;
  font-size: 1.2rem;
  color: var(--gold);
  letter-spacing: 2px;
  background: rgba(0,0,0,0.3);
  padding: 8px 12px;
  border-radius: 4px;
  flex: 1;
}

.admin__key-copy {
  padding: 8px 16px;
  background: var(--gold);
  border: none;
  border-radius: 4px;
  color: var(--navy);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.admin__key-copy:hover {
  background: var(--gold-light);
  transform: translateY(-1px);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .admin__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .admin__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .admin__search {
    max-width: 100%;
  }
  
  .admin__form-grid {
    grid-template-columns: 1fr;
  }
  
  .admin__table th:nth-child(3),
  .admin__table td:nth-child(3) {
    font-size: 0.85rem;
  }
}
</style>