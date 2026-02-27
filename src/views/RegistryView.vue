<template>
  <div class="registry">
    <div class="registry__grid" aria-hidden="true"></div>
    
    <div class="registry__container">
      <!-- Header -->
      <div class="registry__header">
        <h1 class="registry__title">Управление пропусками</h1>
        <p class="registry__subtitle">Los Santos County Sheriff's Department</p>
        <div class="registry__badge">
          <span class="registry__badge-icon">⬢</span>
          <span>Режим редактирования</span>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="registry__toolbar">
        <button class="registry__btn registry__btn--primary" @click="showAddOfficerModal = true">
          <span>➕</span>
          Оформить новый пропуск
        </button>
        <div class="registry__search">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по имени, фамилии или ID карты..."
            class="registry__search-input"
          />
        </div>
      </div>

      <!-- Officers Table -->
      <div class="registry__table-container">
        <table class="registry__table">
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
                <div class="registry__id-card">
                  <span class="registry__id-prefix">LSSD-</span>
                  <span class="registry__id-number">{{ officer.idCard }}</span>
                </div>
              </td>
              <td>
                <span class="registry__status" :class="`registry__status--${officer.status.toLowerCase()}`">
                  {{ officer.status === 'ACTIVE' ? 'ДОСТУП РАЗРЕШЕН' : 'ДОСТУП ЗАКРЫТ' }}
                </span>
              </td>
              <td>
                <div class="registry__actions">
                  <button class="registry__action-btn" @click="editOfficer(officer)" title="Редактировать">✏️</button>
                  <button class="registry__action-btn" @click="toggleStatus(officer)" :title="officer.status === 'ACTIVE' ? 'Закрыть доступ' : 'Открыть доступ'">
                    {{ officer.status === 'ACTIVE' ? '🔒' : '🔓' }}
                  </button>
                  <button class="registry__action-btn" @click="deleteOfficer(officer.id)" title="Удалить">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Add/Edit Officer -->
    <Transition name="modal">
      <div v-if="showAddOfficerModal" class="registry__modal-overlay" @click.self="showAddOfficerModal = false">
        <div class="registry__modal">
          <div class="registry__modal-header">
            <h3>{{ editingOfficer ? 'Редактировать пропуск' : 'Оформить новый пропуск' }}</h3>
            <button class="registry__modal-close" @click="showAddOfficerModal = false">×</button>
          </div>
          <form @submit.prevent="saveOfficer" class="registry__modal-form">
            <div class="registry__form-grid">
              <label class="registry__form-field">
                <span>Имя</span>
                <input v-model="officerForm.firstName" required class="registry__form-input" />
              </label>
              <label class="registry__form-field">
                <span>Фамилия</span>
                <input v-model="officerForm.lastName" required class="registry__form-input" />
              </label>
              <label class="registry__form-field">
                <span>ID карта</span>
                <div class="registry__id-input-group">
                  <span class="registry__id-prefix-input">LSSD-</span>
                  <input v-model="officerForm.idCard" required class="registry__id-input" placeholder="000000" maxlength="6" />
                </div>
              </label>
              <label class="registry__form-field">
                <span>Статус доступа</span>
                <select v-model="officerForm.status" required class="registry__form-select">
                  <option value="ACTIVE">Доступ разрешен</option>
                  <option value="INACTIVE">Доступ закрыт</option>
                </select>
              </label>
            </div>
            <div class="registry__modal-actions">
              <button type="button" class="registry__btn registry__btn--secondary" @click="showAddOfficerModal = false">
                Отмена
              </button>
              <button type="submit" class="registry__btn registry__btn--primary">
                {{ editingOfficer ? 'Сохранить' : 'Оформить' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showAddOfficerModal = ref(false)
const editingOfficer = ref(null)

// Форма сотрудника
const officerForm = ref({
  firstName: '',
  lastName: '',
  idCard: '',
  status: 'ACTIVE'
})

// Данные
const officers = ref([])

// Загрузка данных
onMounted(() => {
  checkAuth()
  loadData()
})

const checkAuth = () => {
  const auth = localStorage.getItem('lssd_auth')
  if (!auth) {
    router.push('/login')
    return
  }
}

const loadData = () => {
  const savedOfficers = localStorage.getItem('lssd_officers')
  officers.value = savedOfficers ? JSON.parse(savedOfficers) : []
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

// CRUD операции
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
}

const editOfficer = (officer) => {
  editingOfficer.value = officer
  officerForm.value = { ...officer }
  showAddOfficerModal.value = true
}

const toggleStatus = (officer) => {
  officer.status = officer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  saveToStorage()
}

const deleteOfficer = (id) => {
  if (confirm('Удалить этот пропуск из реестра?')) {
    officers.value = officers.value.filter(o => o.id !== id)
    saveToStorage()
  }
}

const saveToStorage = () => {
  localStorage.setItem('lssd_officers', JSON.stringify(officers.value))
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

.registry {
  min-height: calc(100vh - 120px);
  background: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  position: relative;
  padding: 40px 20px;
}

.registry__grid {
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

.registry__container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.registry__header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(198,167,86,0.2);
  position: relative;
}

.registry__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--white);
  margin: 0;
  letter-spacing: 3px;
}

.registry__subtitle {
  color: var(--gold);
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 5px 0 10px;
}

.registry__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(110, 232, 154, 0.1);
  border: 1px solid rgba(110, 232, 154, 0.3);
  border-radius: 4px;
  color: #6ee89a;
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.registry__badge-icon {
  font-size: 0.7rem;
}

.registry__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 20px;
}

.registry__btn {
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

.registry__btn--primary {
  background: linear-gradient(135deg, var(--gold), #a8883e);
  color: var(--navy);
}

.registry__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(198,167,86,0.3);
}

.registry__btn--secondary {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(198,167,86,0.2);
  color: var(--white);
}

.registry__btn--secondary:hover {
  border-color: var(--gold);
}

.registry__search {
  flex: 1;
  max-width: 400px;
}

.registry__search-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
}

.registry__search-input:focus {
  outline: none;
  border-color: var(--gold);
}

.registry__table-container {
  background: var(--navy-card);
  border: 1px solid rgba(198,167,86,0.15);
  border-radius: 8px;
  overflow-x: auto;
}

.registry__table {
  width: 100%;
  border-collapse: collapse;
}

.registry__table th {
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

.registry__table td {
  padding: 16px;
  color: var(--white);
  border-bottom: 1px solid rgba(198,167,86,0.1);
}

.registry__table tr:last-child td {
  border-bottom: none;
}

.registry__table tr:hover td {
  background: rgba(198,167,86,0.05);
}

.registry__id-card {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 0.95rem;
}

.registry__id-prefix {
  color: var(--gold);
  font-weight: 600;
}

.registry__id-number {
  color: var(--white);
  letter-spacing: 1px;
  background: rgba(0,0,0,0.3);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(198,167,86,0.2);
}

.registry__status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.registry__status--active {
  background: rgba(110, 232, 154, 0.15);
  border: 1px solid rgba(110, 232, 154, 0.3);
  color: #6ee89a;
}

.registry__status--inactive {
  background: rgba(224, 79, 79, 0.15);
  border: 1px solid rgba(224, 79, 79, 0.3);
  color: #e04f4f;
}

.registry__actions {
  display: flex;
  gap: 8px;
}

.registry__action-btn {
  padding: 6px 10px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.registry__action-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
  background: rgba(198,167,86,0.1);
}

/* Modal Styles */
.registry__modal-overlay {
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

.registry__modal {
  width: 500px;
  max-width: 90vw;
  background: var(--navy-mid);
  border: 1px solid var(--gold);
  border-radius: 8px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.registry__modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(198,167,86,0.2);
}

.registry__modal-header h3 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin: 0;
  letter-spacing: 1px;
}

.registry__modal-close {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.registry__modal-close:hover {
  color: var(--gold);
}

.registry__modal-form {
  padding: 20px;
}

.registry__form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.registry__form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.registry__form-field span {
  color: var(--muted);
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.registry__form-input,
.registry__form-select {
  padding: 10px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
}

.registry__form-input:focus,
.registry__form-select:focus {
  outline: none;
  border-color: var(--gold);
}

.registry__id-input-group {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  overflow: hidden;
}

.registry__id-prefix-input {
  padding: 10px 12px;
  background: rgba(198,167,86,0.1);
  color: var(--gold);
  font-weight: 600;
  border-right: 1px solid rgba(198,167,86,0.2);
}

.registry__id-input {
  flex: 1;
  padding: 10px;
  background: none;
  border: none;
  color: var(--white);
  font-family: monospace;
  font-size: 1rem;
}

.registry__id-input:focus {
  outline: none;
}

.registry__modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .registry__toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .registry__search {
    max-width: 100%;
  }
  
  .registry__form-grid {
    grid-template-columns: 1fr;
  }
  
  .registry__table th:nth-child(3),
  .registry__table td:nth-child(3) {
    font-size: 0.85rem;
  }
}
</style>