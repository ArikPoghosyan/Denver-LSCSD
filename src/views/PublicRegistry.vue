<template>
  <div class="public-registry">
    <div class="public-registry__grid" aria-hidden="true"></div>
    
    <div class="public-registry__container">
      <!-- Header -->
      <div class="public-registry__header">
        <h1 class="public-registry__title">Реестр пропусков</h1>
        <p class="public-registry__subtitle">Los Santos County Sheriff's Department</p>
        <div class="public-registry__badge">
          <span class="public-registry__badge-icon">⬢</span>
          <span>Публичный доступ · Только просмотр</span>
        </div>
      </div>

      <!-- Search -->
      <div class="public-registry__search-container">
        <div class="public-registry__search">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по имени, фамилии или ID карты..."
            class="public-registry__search-input"
          />
          <span class="public-registry__search-icon">🔍</span>
        </div>
        <div class="public-registry__stats">
          Всего пропусков: {{ filteredOfficers.length }}
        </div>
      </div>

      <!-- Officers Table -->
      <div class="public-registry__table-container">
        <table class="public-registry__table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>ID карта</th>
              <th>Статус доступа</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOfficers.length === 0">
              <td colspan="4" style="text-align: center; color: var(--muted); padding: 60px;">
                Нет записей в реестре
              </td>
            </tr>
            <tr v-for="officer in filteredOfficers" :key="officer.id">
              <td>{{ officer.firstName }}</td>
              <td>{{ officer.lastName }}</td>
              <td>
                <div class="public-registry__id-card">
                  <span class="public-registry__id-prefix">LSSD-</span>
                  <span class="public-registry__id-number">{{ officer.idCard }}</span>
                </div>
              </td>
              <td>
                <span class="public-registry__status" :class="`public-registry__status--${officer.status.toLowerCase()}`">
                  {{ officer.status === 'ACTIVE' ? 'ДОСТУП РАЗРЕШЕН' : 'ДОСТУП ЗАКРЫТ' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer note -->
      <div class="public-registry__footer">
        <p>Для оформления пропуска необходимо <router-link to="/login" class="public-registry__link">войти в систему</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchQuery = ref('')
const officers = ref([])

// Загрузка данных
onMounted(() => {
  loadData()
})

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
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

.public-registry {
  min-height: calc(100vh - 120px);
  background: var(--navy);
  font-family: 'Rajdhani', sans-serif;
  position: relative;
  padding: 40px 20px;
}

.public-registry__grid {
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

.public-registry__container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.public-registry__header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(198,167,86,0.2);
  position: relative;
}

.public-registry__title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  color: var(--white);
  margin: 0;
  letter-spacing: 3px;
}

.public-registry__subtitle {
  color: var(--gold);
  font-size: 0.9rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 5px 0 10px;
}

.public-registry__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(198,167,86,0.1);
  border: 1px solid rgba(198,167,86,0.3);
  border-radius: 4px;
  color: var(--gold);
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.public-registry__badge-icon {
  font-size: 0.7rem;
}

.public-registry__search-container {
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.public-registry__search {
  position: relative;
  flex: 1;
  max-width: 500px;
}

.public-registry__search-input {
  width: 100%;
  padding: 14px 20px 14px 45px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(198,167,86,0.2);
  border-radius: 4px;
  color: var(--white);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.public-registry__search-input:focus {
  outline: none;
  border-color: var(--gold);
}

.public-registry__search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 1.1rem;
}

.public-registry__stats {
  color: var(--muted);
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 8px 16px;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

.public-registry__table-container {
  background: var(--navy-card);
  border: 1px solid rgba(198,167,86,0.15);
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 30px;
}

.public-registry__table {
  width: 100%;
  border-collapse: collapse;
}

.public-registry__table th {
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

.public-registry__table td {
  padding: 16px;
  color: var(--white);
  border-bottom: 1px solid rgba(198,167,86,0.1);
}

.public-registry__table tr:last-child td {
  border-bottom: none;
}

.public-registry__table tr:hover td {
  background: rgba(198,167,86,0.05);
}

.public-registry__id-card {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: monospace;
  font-size: 0.95rem;
}

.public-registry__id-prefix {
  color: var(--gold);
  font-weight: 600;
}

.public-registry__id-number {
  color: var(--white);
  letter-spacing: 1px;
  background: rgba(0,0,0,0.3);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(198,167,86,0.2);
}

.public-registry__status {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.public-registry__status--active {
  background: rgba(110, 232, 154, 0.15);
  border: 1px solid rgba(110, 232, 154, 0.3);
  color: #6ee89a;
}

.public-registry__status--inactive, 
.public-registry__status--suspended {
  background: rgba(224, 79, 79, 0.15);
  border: 1px solid rgba(224, 79, 79, 0.3);
  color: #e04f4f;
}

.public-registry__footer {
  text-align: center;
  padding: 20px;
  color: var(--muted);
  font-size: 0.9rem;
  border-top: 1px solid rgba(198,167,86,0.1);
}

.public-registry__link {
  color: var(--gold);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.public-registry__link:hover {
  color: var(--gold-light);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .public-registry__search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .public-registry__search {
    max-width: 100%;
  }
  
  .public-registry__stats {
    text-align: center;
  }
  
  .public-registry__table th:nth-child(3),
  .public-registry__table td:nth-child(3) {
    display: none;
  }
}
</style>